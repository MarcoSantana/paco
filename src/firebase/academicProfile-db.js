import { firestore } from 'firebase'
import { isNil } from 'lodash'
import GenericDB from './generic-db'

export default class AcademicProfileDB extends GenericDB {
  constructor(userId) {
    super(`profiles/${userId}`)
    this.userId = userId
  }

  // Oveaload the generic-db method
  async read(id) {
    const result = await (await firestore())
      .collection('profiles')
      .doc(id)
      .get()
    const data = result.exists ? result.data() : null

    if (isNil(data)) return null

    this.convertObjectTimestampPropertiesToDate(data)
    return { id, ...data }
  }

  // asyn update firestore document
  async update(data) {
    if (isNil(this.userId)) return null
    if (isNil(data)) return null
    if (isNil(data.documentName)) return null

    console.log('data', data)
    try {
      return firestore()
        .collection('profiles')
        .doc(this.userId)
        .update({ [data.documentName]: data })
    } catch (error) {
      console.error('Error updating the profile', error)
    }
    return data
  }

  // async update(data) {
  //   console.log('update', data)
  //   console.log('this.userId', this.userId)
  //   const id = this.userId
  //   console.log('id', id)
  //   return true
  // const result = await (await firestore())
  //   .collection('profiles')
  //   .doc(id)
  //   .update({
  //     ...data,
  //   })
  // const returnData = result.exists ? result.data() : null

  // if (isNil(returnData)) return null

  // this.convertObjectTimestampPropertiesToDate(returnData)
  // return { ...returnData }
  // }

  // Oveaload the generic-db method
  // async update(data) {
  //   console.log('update data', data)
  //   const serverTimestamp = firestore.FieldValue.serverTimestamp()
  //   console.log('update', data)
  //   const result = await firestore()
  //     .collection('profiles')
  //     .doc(userId)
  //     .update({
  //       name: data.name,
  //       ...data,
  //       updatedAt: serverTimestamp,
  //     })
  //     .then(response => {
  //       console.log('update result', response)
  //       return data
  //     })
  //   return result
  // }
}
