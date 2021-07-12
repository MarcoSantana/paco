// import { isNil } from 'lodash'
import GenericDB from './generic-db'

// Documents
export default class DocumentsDB extends GenericDB {
  // constructor(userId) {
  constructor() {
    // super(`users/${userId}/documents`)
    super('documents')
  }

  // /**
  //  * Queries the db for this item, returns bool
  //  * @param documentId
  //  */
  // async checkUniqueUserDocument(documentId) {
  //   console.log('documentName :>> ', documentId)
  //   const result = await this.read(documentId)
  //   return !isNil(result)
  // }
  // Here you can extend UserDocumentsDB with custom methods
}
