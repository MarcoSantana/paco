import GenericDB from './generic-db'

export default class UserEventsDB extends GenericDB {
  constructor(userId) {
    super(`users/${userId}/events`)
  }

  async userEvent(eventId) {
    const result = await this.read(eventId)
    return result
  }

  /**
   * @param {String} eventId
   * @returns {Object}
   */
  async documents(eventId) {
    const result = await this.read(eventId)
    return result.documents
  }
}
