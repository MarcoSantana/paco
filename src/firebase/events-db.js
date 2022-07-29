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
   * @returns {{type: string, message: string}} Returns the message
   */
  async getUserMessage({ userId = null, eventId = null } = {}) {
    try {
      const eventUserRef = (await firestore()).collection(this.collectionPath)
      return eventUserRef
        .doc(eventId)
        .collection('users')
        .doc(userId)
        .get()
        .then(res => {
          const { message, status } = res.data()
          const updateTimestamp = res.data().updateTimestamp.toDate()
          return { message, updateTimestamp, status }
        })
    } catch (error) {
      console.error(`Error getting users for event ${eventId}`, error)
      const result = {
        type: 'error',
        message: `Error al obtener el mensaje ${error}`,
      }
      return result
    }
  } // getUserMessage
}
