// <reference path='src/typedefs.js' />

import UserDocumentsDB from '@/firebase/user-documents-db'
import UsersDB from '@/firebase/users-db'
import DocumentsDB from '@/firebase/documents-db'
import CountersDB from '@/firebase/counters-db'
import MailsDB from '@/firebase/mails-db'
import EventsDB from '@/firebase/events-db'
import { storage } from 'firebase'
import Message from '@/classes/Message'

export default {
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
      orderBy,
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

  /**
* @param  commit  - The admin (vuex) mutations
* @param {Object} payload - The query with constraints
*/
  getUsers: async ({ commit }, { constraints, limit, orderBy, startAt, endAt } = {}) => {
    console.log('constraints', constraints)
    const localMessage = new Message({ type: 'info', message: 'Inicializando búsqueda de usuarios' })
    // if (!constraints) {
    //   // localMessage.currentType = 'error'
    //   // localMessage.currentMessage = `Error al generar consulta`
    //   // console.error("Error al generar consulta con: ", constraints)
    //   return []
    // }
    console.log('constraints ', constraints)
    console.log('limit', limit)
    console.log('order', orderBy)
    console.log('startAt', startAt)
    console.log('endAt', endAt)

    commit('setGlobalMessage', localMessage)
    // localMessage.currentType = 'info'
    // localMessage.currentMessage = `Iniciando búsqueda `
    console.log('getAll users as admin')
    const usersDB = new UsersDB()
    const result = await usersDB
      .readWithPagination(constraints, startAt, endAt, limit, orderBy)
    commit('setUsers', result)
    return result
    // localMessage.currentType = 'info'
    // localMessage.currentMessage = `Busqueda terminada con ${result.length} resultados`
    // commit('setGlobalMessage', localMessage)
  }, // getUsers

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
