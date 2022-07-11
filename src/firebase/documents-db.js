import GenericDB from './generic-db';

// Documents
export default class DocumentsDB extends GenericDB {
  // constructor(userId) {
  constructor() {
    // super(`users/${userId}/documents`)
    super('documents');
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
    ];
    const result = await this.readAll(constraints);
    console.log('result :>> ', result);
    console.log('result.length :>> ', result.length);
    return result.length === 0;
  }
}
