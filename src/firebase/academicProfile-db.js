import { firestore } from 'firebase'
import { isNil } from 'lodash'
import GenericDB from './generic-db'

export default class AcademicProfileDB extends GenericDB {
  constructor(userId) {
    super(`users/${userId}/profile`)
    this.userId = userId
  }

  // asyn update firestore document
  async update(data) {
    if (isNil(this.userId)) return null
    if (isNil(data)) return null
    if (isNil(data.documentName)) return null

    try {
      return firestore()
        .collection('users')
        .doc(this.userId)
        .collection('profile')
        .doc(data.documentName)
        .set({
          ...data,
          updateTimestamp: firestore.FieldValue.serverTimestamp()
        })
    } catch (error) {
      console.error('Error updating the profile', error)
    }
    return data
  }
}
