import GenericDB from './generic-db'

export default class FormsDB extends GenericDB {
  constructor(userId) {
    super(`users/${userId}/forms`)
  }

  // Here you can extend UserDB with custom methods
}
