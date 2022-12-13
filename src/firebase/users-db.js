import GenericDB from './generic-db'
import firestore from './async-firestore'
import { isNil } from 'lodash'

export default class UsersDB extends GenericDB {
  constructor() {
    super('users')
  } // constructor

  async getPersonalProfile(id) {
    try {
      /** @type {Object<firebase.firestore.DocumentReference>} */
      const ref = (await firestore())
        .collection(this.collectionPath)
        .doc(id)
        .collection('personalProfile')

      /** @type {Array{Object}} */
      const profileRes = []

      await ref.get().then((snapShot) => {
        snapShot.forEach((doc) => {
          console.log('profileRef', doc.id)
          console.log(doc.id, '=>', doc.data())
          this.convertObjectTimestampPropertiesToDate(doc.data())
          profileRes.push({ ...doc.data(), id: doc.id })
        })
      })
      return profileRes
    } catch (error) {
      console.log('error fetching personal profile', error)
    }
  } // getPersonalProfile

  async getUserWithAcademicProfile(id) {
    /** @type {Object<firebase.firestore.DocumentReference>} */
    const ref = (await firestore()).collection(this.collectionPath).doc(id)

    const profileRes = []

    const user = await this.read(id)
    await ref
      .collection('profile')
      .get()
      .then((snapShot) =>
        snapShot.forEach((doc) => {
          profileRes[doc.id] = { ...doc.data(), id: doc.id }
        })
      )
    return {
      ...user,
      profile: { ...profileRes },
    }
  }

  /** Read user with profile
   * @param {string} id
   */
  async getUserWithProfile(id) {
    /** @type {Object<firebase.firestore.DocumentReference>} */
    const profileRef = (await firestore())
      .collection(this.collectionPath)
      .doc(id)
      .collection('profile')

    const profileRes = []

    await profileRef.get().then((snapShot) => {
      snapShot.forEach((doc) => {
        this.convertObjectTimestampPropertiesToDate(doc.data())
        profileRes.push({ documentName: doc.id, ...doc.data() })
      })
    })

    const personalProfile = await this.getPersonalProfile(id)

    const user = await this.read(id)

    if (profileRes.length < 1) return null

    return {
      ...user,
      profile: profileRes,
      personalProfile: [...personalProfile],
    }
  }

  /**
   * Get a user's event.
   * @param {Object} params - The parameters.
   * @param {string} params.userId - The user's ID.
   * @param {string} params.eventId - The event's ID.
   * @returns {Promise<Object>} - The user's event.
   */
  async getUserEvent({ userId, eventId }) {
    /** @type {firebase.firestore.DocumentReference} */
    const ref = (await firestore())
      .collection('users')
      .doc(userId)
      .collection('events')
      .doc(eventId)

    /** @type {firebase.firestore.DocumentSnapshot} */
    const snapshot = await ref.get()

    if (!snapshot.exists) {
      throw new Error(`Event with ID "${eventId}" not found.`)
    }

    /** @type {Object} */
    const event = snapshot.data()
    console.log('event', event)
    return {
      ...event,
      id: snapshot.id,
    }
  } // getUserEvent

  /**
   * Update a document in the collection
   * @param payload
   */
  async updatePersonalProfile(payload) {
    const { id } = payload
    const { data } = payload
    delete payload.id
    if (isNil(id)) throw new Error('id is required')
    const ref = (await firestore())
      .collection(this.collectionPath)
      .doc(id)
      .collection('personalProfile')
    Object.keys(data).forEach(async (key) => {
      await ref
        .doc(data[key].documentName)
        .set({ ...data[key] }, { merge: true })
        .catch((err) => {
          console.error('Error updating user personal profile', err)
        })
    })

    // for (const [key, value] of Object.entries(data)) {
    //   console.log(`${key}: ${value}`);
    //   await ref.doc(value.documentName)
    //     .set({ ...value }, { merge: true })
    //     .then(() => console.log("Document successfully written!"))
    //     .catch((error) => {
    //       console.error("Error writing document: ", error);
    // } // for
    //     })
  }

  // Get a user college
  // ad jsdoc comment:
  /**
   * Gets the specified user specialty hospital
   * @param {String} id the user's id
   * @returns {Object | null}
   */
  async getUserSpecialtyHospital(id) {
    if (isNil(id)) throw new Error('id is required')
    /** @type {firebase.firestore.DocumentReference} */
    const ref = (await firestore())
      .collection(this.collectionPath)
      .doc(id)
      .collection('profile')
      .doc('specialty')
    /** @type {firebase.firestore.DocumentSnapshot} */
    const result = await ref.get()

    return result.exists ? result.data() : null
  } // getUserSpecialtyHospital
}
