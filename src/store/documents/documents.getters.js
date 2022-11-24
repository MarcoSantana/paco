import { find } from 'lodash'

export default {
  /**
   * Check if a document has deletion pending
   */
  isDocumentDeletionPending: (state) => (documentId) =>
    state.documentDeletionPending.includes(documentId),

  /**
   * Get document by id
   */
  getDocumentById: (state) => (documentId) =>
    find(state.documents, (document) => document.id === documentId),

  /**
   * Gets pending documents from documents state
   */
  pendingDocuments: (state) => state.documents.filter((doc) => doc.status === 1),

  /**
   * Gets rejected documents from documents state
   */
  rejectedDocuments: (state) =>
    find(state.documents, (document) => document.status === 4),
}
