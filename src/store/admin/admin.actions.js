// <reference path='src/typedefs.js' />

import { saveAs } from 'file-saver'
import UserDocumentsDB from '@/firebase/user-documents-db'
import UsersDB from '@/firebase/users-db'
import DocumentsDB from '@/firebase/documents-db'
import CountersDB from '@/firebase/counters-db'
import MailsDB from '@/firebase/mails-db'
import EventsDB from '@/firebase/events-db'
import { storage } from 'firebase'
import Message from '@/classes/Message'

export default {
  //   getEventSpreadsheet: aysnc({ _ }, eventId) => {
  //   debugger
  //   console.log('getEventSpreadsheet', eventId)
  //   const users = getAcceptedRequest(eventId)
  // },

  getEventSpreadsheet: async ({ rootState, commit }, eventId) => {

    console.log(rootState)
    console.log(commit)
    const eventsDb = new EventsDB()

    const usersDb = new UsersDB()
    /**@type {Object[]} - The result from querying all user in a request */
    const res = await eventsDb.getUsers(eventId)

    /**@type {Object[]} */
    const acceptedRequests = res.filter(user => {
      return user.status === 'accepted' && user.userId
    })

    /**@type {Object[]} */
    const acceptedUsers = await Promise.all(acceptedRequests.map(async item => {
      if (item && item.userId)
        return await usersDb.read(item.userId)
    }))

    debugger
    console.log('acceptedUsers', acceptedUsers)
    debugger

    const csvString = [
      [
        'id',
        'displayName',
        'email'],
      ...acceptedUsers.map(item => {
        console.log('item.id', item.id)
        console.log('item.displayName', item.displayName)
        return [
          item.id,
          item.displayName,
          item.email,
        ]
      })
    ]
      .map(e => e.join(","))
      .join("\n");
    console.log('result', csvString)
    debugger
    const blob = new Blob([csvString], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `${eventId}-compressedCSV.csv`)

    // const zip = new JSZip()
    // zip
    //   .file(`${eventId}-accpetedList.csv`, result)
    //   .generateAsync({ type: 'blob' })
    //   .then(res => saveAs(res, `${eventId}-compressedCSV.zip`))
    // console.log('res', csvString)

    // return the final data
    // return csvString
  }, // getEventSpreadsheet 
  /**
   * Fetch documents of current loggedin user
   */
  getUserDocuments: async ({ rootState, commit }) => {
    console.log('Get User Documents')
    const userDocumentDb = new UserDocumentsDB(rootState.authentication.user.id)
    const documents = await userDocumentDb.readAll()
    commit('setDocuments', documents)
  },

  /**
   * Fetch all documents if logged user is admin
   */
  getAllDocuments: async ({ rootState, commit }, payload) => {
    const documentsDb = new DocumentsDB(`${rootState.authentication.user.id}`)
    console.log('Get all documents(admin)')
    console.log('payload :>> ', payload)
    const { startAt, endAt, constraints, limit, orderBy } = payload
    const documents = await documentsDb.readWithPagination(
      constraints,
      startAt,
      endAt,
      limit,
      orderBy
    )
    console.log('documents', documents)
    // const documents = await documentsDb.readAllAsAdmin()
    // console.log('documents: ', documents)
    commit('setDocuments', documents)
  },

  /**
   * Create a document for current loggedin user
   */
  createUserDocument: async ({ commit, rootState }, document) => {
    const userDocumentDb = new UserDocumentsDB(rootState.authentication.user.id)

    commit('setDocumentCreationPending', true)
    // const addUniqueUserDocument = await userDocumentDb.addUniqueUserDocument(document.name)
    // console.log('addUniqueUserDocument :>> ', addUniqueUserDocument)
    const docExists = await userDocumentDb.checkUniqueUserDocument(
      document.name
    )
    try {
      if (!docExists) {
        const { upload } = document
        delete document.upload
        document.files = Object.keys(upload)
        console.log('document.files :>> ', document.files)
        console.log('upload :>> ', upload)
        // TODO here we mmust traverse the new uploads object to extract only the keys and create the route and those values must be inserted into a new object node maybe called again uploads or maybe files 202106.27-18.51
        const createdDocument = await userDocumentDb.create(
          document,
          document.name
        )

        // Create a root reference
        const storageRef = storage().ref(
          `documents/${rootState.authentication.user.id}`
        )
        document.files.forEach(element => {
          console.log('element :>> ', element)
          const documentRef = storageRef
            .child(`${document.name}/${element}`)
            .putString(upload[element], 'data_url')
            .then(snapshot => console.log(snapshot))
          console.log('documentRef :>> ', documentRef)
        })
        commit('addDocument', createdDocument)
        commit('setDocumentCreationPending', false)
        return createdDocument
      }
      throw new Error('El documento ya existe')
    } catch (error) {
      console.log('Error', error)
    }
    return null
  },

  /**
   * Create a new document for current loggedin user and reset document name input
   */
  triggerAddDocumentAction: ({ dispatch, state, commit }, data) => {
    if (state.documentNameToCreate === '') return

    const document = { name: state.documentNameToCreate, ...data }
    commit('setDocumentNameToCreate', '')
    dispatch('createUserDocument', document)
  },

  /**
   * Delete (as admin) a document from its id
   */
  // FIXME rename to triggerDeleteDocument
  deleteUserDocument: async ({ rootState, commit, getters }, documentId) => {
    if (getters.isDocumentDeletionPending(documentId)) return

    const documentsDb = new DocumentsDB(rootState.authentication.user.id)
    commit('addDocumentDeletionPending', documentId)
    await documentsDb.delete(documentId)
    // FIXME Move this to a cloud function
    commit('removeDocumentById', documentId)
    commit('removeDocumentDeletionPending', documentId)
  },

  /**
   * Soft Delete (as admin) a document from its id
   */
  triggerSoftDeleteUserDocument: async (
    { rootState, commit, getters },
    documentId
  ) => {
    if (getters.isDocumentDeletionPending(documentId)) return

    const documentsDb = new DocumentsDB(rootState.authentication.user.id)
    commit('addDocumentDeletionPending', documentId)
    await documentsDb.softDelete(documentId)
    commit('removeDocumentById', documentId)
    commit('removeDocumentDeletionPending', documentId)
  },

  /**
   * Fetch from database a counter document ans commit to storage
   */
  getRequestsCounter: async ({ commit }, type) => {
    console.log('admin.actions getRequestsCounter')
    console.log(`Fetching ${type}`)
    const requestsCounter = new CountersDB()
    await requestsCounter
      .fetchRequestsByType(type)
      .then(data =>
        commit(
          `set${type[0].toUpperCase()}${type.slice(1)}RequestsCounter`,
          data
        )
      )
      .catch(err => console.error(err))
  },

  /**
   * Set the current user
   * @param {*} user
   * @param {*} commit
   * @param {*} state
   */
  triggerSetCurrentUser: ({ commit }, user) => commit('setCurrentUser', user), // triggerSetCurrentUser

  /**
   * Set the current document
   * @param {*} document
   * @param {*} commit
   * @param {*} state
   */
  triggerSetCurrentDocument: ({ commit }, document) =>
    commit('setCurrentDocument', document), // triggerSetCurrentDocument

  /**
   * Set the current event
   * @param Object event
   * @param {*} commit
   * @param {*} state
   */
  triggerSetCurrentEvent: ({ commit }, event) =>
    commit('setCurrentEvent', event), // triggerSetCurrentDocument

  /**
   * Fetches all mails if logged user is admin
   * @param Object this.commit
   */
  getAllMails: async ({ commit }) => {
    const mailsDb = new MailsDB()
    const mails = await mailsDb.readAll()
    console.log('mails', mails)
    commit('setMails', mails)
  }, // getAllMails

  /**
   * Fetches from eventsDb user event message
   * @param {Object} payload - The constraints needed
   * @param {string} payload.userId
   * @param {string} payload.eventId
   * @returns {import('@/typedefs').Message}
   * @TODO Destructure object for default values
   * @TODO Add failsafe for params
   */
  getUserEventMessage: async ({ commit }, payload) => {
    const { eventId, userId } = payload
    const eventsDb = new EventsDB()
    const message = eventsDb.getUserMessage({ userId, eventId })
    commit('setCurrentEventMessage', message)
    return message
  }, // getUserEventMessage

  // **************************************************************************** */
  // Users
  // **************************************************************************** */
  /** Populates state.users from db
   * @param  commit  - The admin (vuex) mutations
   * @param {Object} payload - The query with constraints
   */
  getUsers: async ({ commit }) => {
    const localMessage = new Message({
      type: 'info',
      message: 'Inicializando búsqueda de usuarios',
    })
    commit('setGlobalMessage', localMessage)
    console.log('getAll users as admin')
    const usersDB = new UsersDB()
    const result = await usersDB.readAll()
    commit('updateUsers', result)
    return result
  }, // getUsers

  /** Initializes state.users
   *
   * @param  commit  - The admin (vuex) mutations
   * @param state - The vuex global state
   */
  initUsers: async ({ commit }) => {
    commit('setUsers', JSON.parse(localStorage.getItem('users')))
  }, // initUsers

  searchUser: async (
    { commit },
    /**  @type Array<Array<String> */
    constraints
  ) => {
    commit(
      'setGlobalMessage',
      new Message({
        type: 'info',
        message: 'Iniciando la búsqueda',
      })
    )
    if (!constraints) {
      commit(
        'setGlobalMessage',
        new Message({ type: 'info', message: 'Iniciando la búsqueda' })
      )
      return
    }
    const usersDB = new UsersDB()

    const result = await usersDB.readAll(constraints)
    commit(
      'setGlobalMessage',
      new Message({ type: 'info', message: 'Búsqueda finalizada' })
    )
    /** @type Array<{Object}> | null */
    console.log('Result', result)
    commit('updateUsers', result)
  }, // searchUser

  /** Sets the current and populates the admin.users state with the given user data
   * @param {string} userId
   * @return {Object<User>}
   */
  // async function triggerSetCurrentUserWithProfile(userId) {
  async triggerSetCurrentUserWithProfile({ commit, state }, id) {
    if (typeof id !== 'string')
      console.error('userId is not a string', typeof userId)
    const usersDB = new UsersDB()
    const result = await usersDB.getUserWithProfile(id)
    const index = state.users.find((item, i) => {
      if (result && item.id === result.id) {
        state.users[i] = result
        return true
      }
      return i
    })
    console.log('index', index)
    if (result) {
      commit('setCurrentUser', result)
      commit('updateUsers', state.users)
    }
    return result
  },

  /** Updates only the main collection users/{userId}
   * @param {<User>} user - The user data
   * @param {{<Store{Commit}>}} commit
   * @return {string} result - The updated user id
   */
  updateUserData({ commit }, user) {
    commit(
      'setGlobalMessage',
      new Message({ type: 'warning', message: 'Iniciando la edición' })
    )
    if (!user || !user.id) {
      commit(
        'setGlobalMessage',
        new Message({ type: 'error', message: 'Error al editar el usuario' })
      )
      return user
    } // fi
    const usersDB = new UsersDB(user.id)
    return usersDB.update(user).then(id => {
      if (!id)
        commit(
          'setGlobalMessage',
          new Message({ type: 'error', message: 'Error crítico' })
        )

      commit(
        'setGlobalMessage',
        new Message({
          type: 'success',
          message: 'Usuario actualizado exitosamente',
        })
      )
      commit('updateCurrentUser', user)

      commit(
        'setGlobalMessage',
        new Message({
          type: 'success',
          message: 'Listado general de usuarios actualizado',
        })
      )
      commit('updateUsers', [user])
      return id
    })
  },

  /** Updates only the main collection users/{userId}
   * @param {Object} data - The user data
   * @param {string} data.id
   * @param {{<Store{Commit}>}} commit
   * @return {string} result - The updated user id
   */
  updateUserPersonalProfile({ commit }, data) {
    debugger
    console.log('updatePersonalProfile', data)
    commit(
      'setGlobalMessage',
      new Message({ type: 'warning', message: 'Iniciando la edición' })
    )
    if (!data || !data.id) {
      console.error('Missing data', data.id, data)
      commit(
        'setGlobalMessage',
        new Message({ type: 'error', message: 'Error al editar el usuario' })
      )
      return data
    } // fi
    debugger
    console.log('updatePersonalProfile', data)
    const usersDB = new UsersDB(data.id)
    return usersDB.updatePersonalProfile(data).then(id => {
      if (!id)
        commit(
          'setGlobalMessage',
          new Message({ type: 'error', message: 'Error crítico' })
        )

      commit(
        'setGlobalMessage',
        new Message({
          type: 'success',
          message: 'Usuario actualizado exitosamente',
        })
      )
      return id
    })
  },

  // ********************************************************************************/
  // Mail
  // ********************************************************************************/

  /**
   * Sends a mail through firebase plugin
   * @param {import('@/typedefs').Mail} payload - A mail
   * @returns {import('@/typedefs').Message}
   */
  sendMail: async (_, { to, cc, template }) => {
    const mailDB = new MailsDB()
    /** @type {import('@/typedefs').Message} */
    const result = await mailDB
      .send({ to, cc, template })
      .then(mailMessage => mailMessage)
    console.log('result', result)
    return result
  }, // sendMail
}
