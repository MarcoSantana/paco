import GenericDB from './generic-db'
import firestore from './async-firestore'

// Events
export default class EventsDB extends GenericDB {
  constructor() {
    super(`events`)
  }

  async getUsers(id) {
    try {
      const result = await (await firestore())
        .collection(`events`)
        .doc(id)
        .collection(`users`)
        .get()
      const that = this
      const data = result.docs.map(doc => {
        return that.convertObjectTimestampPropertiesToDate(doc.data())
      })
      return data
    } catch (error) {
      console.log(`Error getting users for event ${id}`, error)
      console.error(error)
      return null
    }
  } // getUsers

  /**
   * Queries firestore for the last user-event message
   * @param {Object} payload - The constraints needed
   * @param {string} payload.userId
   * @param {string} payload.eventId
   * @returns {Object <Message>} Returns the message
   */
  async getUserMessage({ userId = null, eventId = null } = {}) {
    try {
      return this.doc(eventId)
        .collection('users')
        .doc(userId)
        .get()
        .then(res => res.data())
    } catch (error) {
      console.log(`Error getting users for event ${eventId}`, error)
      console.error(error)
      const result = {
        type: 'error',
        message: `Error al obtener el mensaje ${error}`,
      }
      return result
    }
  } // getUserMessage
}
