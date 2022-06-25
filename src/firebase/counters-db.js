import GenericDB from './generic-db'

export default class CountersDB extends GenericDB {
  constructor() {
    super('counters')
  }

  async registeredUsers() {
    return this.read('registeredUsers')
  }

  async pendingRequests() {
    return this.read('pendingRequests')
  }

  // Here you can extend CountersDB with custom methods
}
