// import { isNil } from 'lodash'
// import UserEveDB from '@/firebase/user-documents-db'
// import UsersDB from '@/firebase/users-db'
import EventsDB from '@/firebase/events-db'
import UserEventsDB from '@/firebase/user-events-db'
// import DocumentsDB from '@/firebase/documents-db'
// import { callUpdateDocumentStatus } from '@/firebase/functions'
// import { storage } from 'firebase'

export default {
  /**
   * Fetch documents of current loggedin user
   */
  // getUserDocuments: async ({ rootState, commit }) => {
  //   console.log('Get User Documents')
  //   const userDocumentDb = new UserDocumentsDB(rootState.authentication.user.id)

  //   const documents = await userDocumentDb.readAll()
  //   commit('setDocuments', documents)
  // },

  /*
   * Fetch all documents if logged user is admin
   */
  getAllEvents: async ({ rootState, commit }) => {
    const eventsDb = new EventsDB(`${rootState.authentication.user.id}/**`)
    const events = await eventsDb.readAll()
    commit('setEvents', events)
  },

  getUserEvents: async ({ rootState, commit }) => {
    const userEventsDb = new UserEventsDB(rootState.authentication.user.id)
    const userEvents = await userEventsDb.readAll()
    console.log('userEvents: ', userEvents)
    commit('setUserEvents', userEvents)
  },

  /*
   * Gets the event details for the given user if not exists create
   */
  setUserEvent: async ({ rootState }, id) => {
    const userEventsDb = new UserEventsDB(rootState.authentication.user.id)
    const eventsDB = new EventsDB(rootState)
    console.log(eventsDB)
    const userEvent = await userEventsDb.read(id)
    console.log('userEvent: ', userEvent)
    if (!userEvent) {
      try {
        // const createdDocument = await userEventsDb.create(document)
        // console.log('createdEvent: ', createdEvent)
        // commit('addDocument', createdDocument)
        // commit('setDocumentCreationPending', false)
        // commit('setDocumentCreationMessage', { type: 'info', message: 'Documento creado' })
      } catch (error) {
        throw new Error('Error al crear el documento', error)
      }
    }
    // TODO: create the below actions
    //   commit('setDocumentCreationPending', true)
    //   commit('setDocumentCreationMessage', {})
    // TODO: get from the users/events the currentEvent
    // TODO: try to get or add it to the collection
  },

  // /**
  //  * Create a document for current loggedin user
  //  */
  // createUserDocument: async ({ commit, rootState }, document) => {
  //   const userDocumentDb = new UserDocumentsDB(rootState.authentication.user.id)
  //   const documentsDB = new DocumentsDB(rootState.authentication.user.id)
  //   commit('setDocumentCreationPending', true)
  //   commit('setDocumentCreationMessage', {})
  //   const docUnique = await documentsDB.isUniqueUserDocument(document.name, rootState.authentication.user.id)
  //   try {
  //     if (docUnique) {
  //       const { upload } = document
  //       delete document.upload
  //       document.status = 1
  //       try {
  //         const createdDocument = await userDocumentDb.create(document)
  //         commit('addDocument', createdDocument)
  //         commit('setDocumentCreationPending', false)
  //         commit('setDocumentCreationMessage', { type: 'info', message: 'Documento creado' })
  //       } catch (error) {
  //         throw new Error('Error al crear el documento', error)
  //       }
  //       if (upload) {
  //         try {
  //           document.files = Object.keys(upload)
  //           const storageRef = storage().ref(`documents/${rootState.authentication.user.id}`)
  //           document.files.forEach(element => {
  //             storageRef
  //               .child(`${document.name}/${element}`)
  //               .putString(upload[element], 'data_url')
  //               .then(snapshot => console.log(snapshot))
  //           })
  //         } catch (error) {
  //           commit('setDocumentCreationMessage', { type: 'error', message: error })
  //           throw new Error('Error al subir el documento', error)
  //         }
  //       }
  //       // return createdDocument
  //     } else {
  //       throw new Error('El documento ya existe')
  //     }
  //   } catch (error) {
  //     commit('setDocumentCreationMessage', { type: 'error', message: error })
  //     console.log('Error', error)
  //   }
  //   return null
  // },

  /** Update document status to "for revision"
      this is fixed so de user can not accept her own documents
       */
  // setDocumentForReview: async ({ rootState, state }, data) => {
  //   if (isNil(data) || isNil(data.id)) return null
  //   async function getDocumentReference(id) {
  //     console.log('id :>> ', id)
  //     const documentsDB = new DocumentsDB(rootState.authentication.user.id)
  //     const constraints = [['documentId', '==', id]]
  //     const docs = await documentsDB.readAll(constraints)
  //     console.log('docs :>> ', docs[0].id)
  //     return docs[0].id
  //   }
  //   const documentReference = await getDocumentReference(data.id)
  //   console.log('documentReference :>> ', documentReference)
  //   data.status = Number(1)
  //   console.log('state :>> ', state)
  //   console.log('data :>> ', data)
  //   const userDocumentDb = new UserDocumentsDB(rootState.authentication.user.id)
  //   const res = await userDocumentDb
  //     .update(data)
  //     .then(result => {
  //       // TODO Sedn message back to caller 202108.08-13.32
  //       return result
  //     })
  //     .then(() => {
  //       console.log('callUpdateDocumentStatus')
  //       return callUpdateDocumentStatus(documentReference, 1, '')
  //     })
  //   // .then(result => {
  //   //   // this.message = result.data.message
  //   //   console.log('callUpdateDocumentStatus')
  //   //   console.log('result :>> ', result)
  //   // })
  //   return res
  // },

  /**
   * Create a new document for current loggedin user and reset document name input
   */
  // triggerAddDocumentAction: ({ dispatch, state, commit }, data) => {
  //   if (state.documentNameToCreate === '') return

  //   const document = { name: state.documentNameToCreate, ...data }
  //   commit('setDocumentNameToCreate', '')
  //   dispatch('createUserDocument', document)
  // },

  /**
   * Delete a user document from its id
   */
  // deleteUserDocument: async ({ rootState, commit, getters }, documentId) => {
  //   if (getters.isDocumentDeletionPending(documentId)) return

  //   const userDocumentsDb = new UserDocumentsDB(rootState.authentication.user.id)

  //   commit('addDocumentDeletionPending', documentId)
  //   await userDocumentsDb.delete(documentId)
  //   commit('removeDocumentById', documentId)
  //   commit('removeDocumentDeletionPending', documentId)
  // },
}
