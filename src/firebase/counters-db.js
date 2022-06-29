import GenericDB from './generic-db'

export default class CountersDB extends GenericDB {
  constructor() {
    super('counters')
  }

  async registeredUsers() {
    console.log('registeredUsers', await this.read('registeredUsers'))
    return this.read('registeredUsers')
  }

  async acceptedRequests() {
    return this.read('acceptedRequests')
  }

  async pendingRequests() {
    return this.read('pendingRequests')
  }

  async rejectedRequests() {
    return this.read('rejectedRequests')
  }

  async fetchRequestsByType(type) {
    return this.read(`${type}Requests`)
  }
}
