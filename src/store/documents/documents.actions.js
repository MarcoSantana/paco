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

  /*
   * Fetch all documents if logged user is admin
   */
  getAllDocuments: async ({ rootState, commit }) => {
    // FIXME romove all "clos"
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
    const docUnique = await documentsDB.isUniqueUserDocument(document.name, rootState.authentication.user.id)
    try {
      if (docUnique) {
        const { upload } = document
        delete document.upload
        document.status = 1
        try {
          const createdDocument = await userDocumentDb.create(document)
          commit('addDocument', createdDocument)
          commit('setDocumentCreationPending', false)
          commit('setDocumentCreationMessage', { type: 'info', message: 'Documento creado' })
        } catch (error) {
          throw new Error('Error al crear el documento', error)
        }
        if (upload) {
          try {
            document.files = Object.keys(upload)
            const storageRef = storage().ref(`documents/${rootState.authentication.user.id}`)
            document.files.forEach(element => {
              storageRef
                .child(`${document.name}/${element}`)
                .putString(upload[element], 'data_url')
                .then(snapshot => console.log(snapshot))
            })
          } catch (error) {
            commit('setDocumentCreationMessage', { type: 'error', message: error })
            throw new Error('Error al subir el documento', error)
          }
        }
        // return createdDocument
      } else {
        throw new Error('El documento ya existe')
      }
    } catch (error) {
      commit('setDocumentCreationMessage', { type: 'error', message: error })
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
