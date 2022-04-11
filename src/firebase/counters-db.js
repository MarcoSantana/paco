import GenericDB from './generic-db'

export default class CountersDB extends GenericDB {
  constructor() {
    super('counters')
  }

  // Here you can extend CountersDB with custom methods
}
