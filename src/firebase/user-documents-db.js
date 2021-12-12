import { isNil } from 'lodash'
import GenericDB from './generic-db'

// Users-documents
export default class UserDocumentsDB extends GenericDB {
  constructor(userId) {
    super(`users/${userId}/documents`)
  }

  /**
   * Queries the db for this item, returns bool
   * @param documentId
   */
  async checkUniqueUserDocument(documentId) {
    console.log('documentName :>> ', documentId)
    const result = await this.read(documentId)
    return !isNil(result)
  }

  /**
   * Queries the db for this item, returns bool
   * @param documentName, userId
   */
  async isUniqueUserDocument(documentName) {
    // TODO query for the document using userId, document name and status
    // it should not be "toBeDeleted (4)"
    // this is not bullet proof since qe can have some duplicated documents such as "Diploma"
    const constraints = [
      ['name', '==', documentName],
    ]
    const result = await this.readAll(constraints)
    return result.length === 0
  }

  /*
   * Get the document by name inside the userDocumentDB
   */
  async getDocumentByName(documentName) {
    const constraints = [['name', '==', documentName]]
    const docs = await this.readAll(constraints)
    return docs
  }
}
