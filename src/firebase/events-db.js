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
  }
}
