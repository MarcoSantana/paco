import UserDocumentsDB from '@/firebase/user-documents-db'
import UsersDB from '@/firebase/users-db'
import DocumentsDB from '@/firebase/documents-db'
import { storage } from 'firebase'

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
  getAllDocuments: async ({ rootState, commit }) => {
    console.log('Get All Documents')
    console.log('rootState: ', rootState)
    const usersDb = new UsersDB(`${rootState.authentication.user.id}/**`)
    const documents = await usersDb.readAllAsAdmin()
    console.log('documents: ', documents)
    commit('setDocuments', documents)
  },

  /**
   * Create a document for current loggedin user
   */
  createUserDocument: async ({ commit, rootState }, document) => {
    const userDocumentDb = new UserDocumentsDB(rootState.authentication.user.id)
    const documentsDB = new DocumentsDB(rootState.authentication.user.id)
    commit('setDocumentCreationPending', true)
    commit('setDocumentCreationMessage', {})
    // const addUniqueUserDocument = await userDocumentDb.addUniqueUserDocument(document.name)
    // console.log('addUniqueUserDocument :>> ', addUniqueUserDocument)
    const docUnique = await documentsDB.isUniqueUserDocument(document.name, rootState.authentication.user.id)
    console.log('docUnique :>> ', docUnique)
    try {
      if (docUnique) {
        const { upload } = document
        delete document.upload
        const createdDocument = await userDocumentDb.create(document)

        commit('addDocument', createdDocument)
        commit('setDocumentCreationPending', false)
        if (upload) {
          document.files = Object.keys(upload)
          // Create a root reference
          const storageRef = storage().ref(`documents/${rootState.authentication.user.id}`)
          document.files.forEach(element => {
            console.log('element :>> ', element)
            const documentRef = storageRef
              .child(`${document.name}/${element}`)
              .putString(upload[element], 'data_url')
              .then(snapshot => console.log(snapshot))
            console.log('documentRef :>> ', documentRef)
          })
        }
        commit('setDocumentCreationMessage', { type: 'info', message: 'Documento creado' })
        return createdDocument
      }
      throw new Error('El documento ya existe')
    } catch (error) {
      commit('setDocumentCreationMessage', { type: 'error', message: 'Error al crear el documento' })
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
   * Delete a user document from its id
   */
  deleteUserDocument: async ({ rootState, commit, getters }, documentId) => {
    if (getters.isDocumentDeletionPending(documentId)) return

    const userDocumentsDb = new UserDocumentsDB(rootState.authentication.user.id)

    commit('addDocumentDeletionPending', documentId)
    await userDocumentsDb.delete(documentId)
    commit('removeDocumentById', documentId)
    commit('removeDocumentDeletionPending', documentId)
  },
}
