import GenericDB from './generic-db'

export default class UserEventsDB extends GenericDB {
  constructor(userId) {
    super(`users/${userId}/events`)
  }

  async userEvent(eventId) {
    const result = await this.read(eventId)
    return result
  }
  // Here you can extend UserEventsDB with custom methods
}
