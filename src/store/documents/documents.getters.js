import { find } from 'lodash'

export default {
  /**
   * Check if a document has deletion pending
   */
  isDocumentDeletionPending: state => documentId => state.documentDeletionPending.includes(documentId),

  /**
   * Get document by id
   */
  getDocumentById: state => documentId => find(state.documents, document => document.id === documentId),
}
