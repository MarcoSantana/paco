//  _______ _______
//  |  |  | |______
//  |  |  | ______|
// author: mSantana
// createdAt 2020-05-06 07:21
// Stardate: 202005.06
// fileName: documents/documents.mutations.js
export default {
  /* Document input name */
  setDocumentNameToCreate: (state, documentNameToCreate) =>
    (state.documentNameToCreate = documentNameToCreate),

  /* Current document */
  setCurrentDocument: (state, document) => (state.currentDocument = document),

  /* Documents */
  setDocuments: (state, documents) => (state.documents = documents),
  addDocument: (state, document) => state.documents.push(document),
  removeDocumentById: (state, documentId) => {
    const index = state.documents.findIndex(
      document => document.id === documentId
    )
    state.documents.splice(index, 1)
  },

  /* Documents deletion */
  addDocumentDeletionPending: (state, documentId) =>
    state.documentDeletionPending.push(documentId),

  removeDocumentDeletionPending: (state, documentId) => {
    const index = state.documents.findIndex(
      document => document.id === documentId
    )
    state.documentDeletionPending.splice(index, 1)
  },

  /* Document creation */
  setDocumentCreationPending: (state, value) =>
    (state.documentCreationPending = value),

  /* Document creation messages */
  setDocumentCreationMessage: (state, payload) =>
    (state.documentCreationMessage = payload),

  /* Documents rejection */
  addDocumentRejectionPending: (state, documentId) =>
    state.documentRejectionPending.push(documentId),

  removeDocumentRejectionPending: (state, documentId) => {
    const index = state.documents.findIndex(
      document => document.id === documentId
    )
    state.documentDeletionPending.splice(index, 1)
  },

  setDocumentRejectionMessage: (state, payload) =>
    (state.documentRejectionMessage = payload),
}
