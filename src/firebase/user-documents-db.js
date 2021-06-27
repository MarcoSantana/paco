import { isNil } from 'lodash'
import GenericDB from './generic-db'

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
  // Here you can extend UserDocumentsDB with custom methods
}
