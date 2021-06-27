import UserDocumentsDB from '@/firebase/user-documents-db'

export default {
  /**
   * Fetch documents of current loggedin user
   */
  getUserDocuments: async ({ rootState, commit }) => {
    const userDocumentDb = new UserDocumentsDB(rootState.authentication.user.id)

    const documents = await userDocumentDb.readAll()
    commit('setDocuments', documents)
  },

  /**
   * Create a document for current loggedin user
   */
  createUserDocument: async ({ commit, rootState }, document) => {
    const userDocumentDb = new UserDocumentsDB(rootState.authentication.user.id)

    commit('setDocumentCreationPending', true)
    const createdDocument = await userDocumentDb.create(document)
    commit('addDocument', createdDocument)
    commit('setDocumentCreationPending', false)
  },

  /**
   * Create a new document for current loggedin user and reset document name input
   */
  triggerAddDocumentAction: ({ dispatch, state, commit }, data) => {
    if (state.documentNameToCreate === '') return

    const document = { name: state.documentNameToCreate, data }
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
