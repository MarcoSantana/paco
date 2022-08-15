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

      await ref.get().then(snapShot => {
        snapShot.forEach(doc => {
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

    await profileRef.get().then(snapShot => {
      snapShot.forEach(doc => {
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

    for (const [key, value] of Object.entries(data)) {
      console.log(`${key}: ${value}`);
      await ref.doc(key)
        .set({ ...value }, { merge: true })
        .then(() => console.log("Document successfully written!"))
        .catch((error) => {
          console.error("Error writing document: ", error);
        })
    } // for
  }
}
