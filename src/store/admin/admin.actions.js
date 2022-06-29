import UserDocumentsDB from '@/firebase/user-documents-db'
// import UsersDB from '@/firebase/users-db'
import DocumentsDB from '@/firebase/documents-db'
import CountersDB from '@/firebase/counters-db'
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
}
