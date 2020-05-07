import GenericDB from './generic-db'

export default class UserDocumentsDB extends GenericDB {
  constructor(userId) {
    super(`users/${userId}/documents`)
  }

  // Here you can extend UserDocumentsDB with custom methods
}
