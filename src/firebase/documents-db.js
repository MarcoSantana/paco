import GenericDB from './generic-db'

// Documents
export default class DocumentsDB extends GenericDB {
  // constructor(userId) {
  constructor() {
    // super(`users/${userId}/documents`)
    super('documents')
  }

  /**
   * Queries the db for this item, returns bool
   * @param documentName, userId
   */
  async isUniqueUserDocument(documentName, userId) {
    // TODO query for the document using userId, document name and status
    // it should not be "toBeDeleted (4)"
    // this is not bullet proof since qe can have some duplicated documents such as "Diploma"
    const constraints = [
      ['userId', '==', userId],
      ['name', '==', documentName],
    ]
    const result = await this.readAll(constraints)
    console.log('result :>> ', result)
    console.log('result.length :>> ', result.length)
    return result.length === 0
  }

  async getByUserDocumentId(documentId) {
    if (this.isNil(documentId)) return null
    const constraints = [['documentId', '==', documentId]]
    return this.readAll(constraints)
  }

  async reject(id, message) {
    const errorMessage = {
      type: 'error',
      message: 'Error al rechazar el documento',
    }
    if (this.isNil(id)) return errorMessage
    const data = {
      id,
      status: 3,
      message,
    }
    return this.update(data)
      .then(documentId => this.read(documentId))
      .then(result => result)
  } // end reject

  async accept(id) {
    const errorMessage = {
      type: 'error',
      message: 'Error al acpetar el documento',
    }
    if (this.isNil(id)) return errorMessage
    const data = {
      id,
      status: 4,
      message: 'Documento aceptado',
    }
    return this.update(data)
      .then(documentId => this.read(documentId))
      .then(result => result)
  } // end accept
}
