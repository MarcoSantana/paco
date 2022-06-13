import { storage } from 'firebase'
import { isNil } from 'lodash'
import GenericDB from './generic-db'

// Users-documents
export default class UserDocumentsDB extends GenericDB {
  constructor(userId) {
    super(`users/${userId}/documents`)
    this.userId = userId
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
    const constraints = [['name', '==', documentName]]
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

  async upsert(document) {
    // return isNil(document.id) ? this.create(document) : this.update(document)
    if (isNil(document.id)) {
      return this.create(document)
    }
    return this.update(document)
  }

  async upload(document, files) {
    try {
      const refDoc = `documents/${this.userId}/${document.id}/${document.name}`
      const documentFiles = []
      files.map((file, index) => {
        documentFiles.push(`${refDoc}-${index}`)
        return storage()
          .ref(`${refDoc}-${index}`)
          .put(file)
      })
      const data = { ...document, files: documentFiles }
      this.update(data)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
