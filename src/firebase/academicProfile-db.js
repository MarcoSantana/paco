// import { isNil } from 'lodash'
// import { firestore } from 'firebase'
import GenericDB from './generic-db'
import firestore from './async-firestore'
import firebase from 'firebase/app'

export default class AcademicProfileDB extends GenericDB {
  constructor(userId) {
    super(`users/${userId}/profile`)
    this.userId = userId
    this.id = userId
  }

  async update(data) {
    const ref = (await firestore())
      .collection('users')
      .doc(this.userId)
      .collection('profile')
      .doc(data.documentName)

    await ref
      .set({
        ...data,
        updateTimestamp: firebase.firestore.FieldValue.serverTimestamp()
      },
        { merge: true })
      .catch(err => console.error("error updating profile", err))
  }
}
