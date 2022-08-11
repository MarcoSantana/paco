import GenericDB from './generic-db'
// import firebase from 'firebase/app'
import firestore from './async-firestore'

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
          profileRes.push({ id: doc.id, ...doc.data() })
        })
      })
      return profileRes
    } catch (error) {
      console.log('error fetching personal profile', error)
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

    await profileRef.get().then(snapShot => {
      snapShot.forEach(doc => {
        console.log('profileRef', doc.id)
        console.log(doc.id, '=>', doc.data())
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
      personalProfile: { ...personalProfile },
    }
  }

  // Here you can extend UserDB with custom methods
}
