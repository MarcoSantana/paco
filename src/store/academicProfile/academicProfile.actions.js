import AcademicProfileDB from '@/firebase/academicProfile-db'
// import { firestore } from 'firebase/app'
import { isNil, unset } from 'lodash'

export default {
  /**
   * Fetch academicProfile of current loggedin user
   */

  getAcademicProfile: async ({ rootState, commit }) => {
    const academicProfileDb = new AcademicProfileDB(
      rootState.authentication.user.id
    )
    const academicProfile = await academicProfileDb
      .readAll()
      .then(arr =>
        arr.map(doc => {
          const temp = {
            [doc.id]: { ...doc },
          }
          unset(temp, `${doc.id}.id`)
          unset(temp, `${doc.id}.documentName`)
          unset(temp, `${doc.id}.createTimestamp`)
          unset(temp, `${doc.id}.createTimestamp`)
          unset(temp, `${doc.id}.updateTimestamp`)
          return temp
        })
      )
      .then(arr => Object.assign({}, ...arr))

    commit('setAcademicProfile', academicProfile)
  },

  triggerUpdateAcademicProfile: async ({ rootState, commit }, data) => {
    if (isNil(data)) {
      return
    }
    try {
      const academicProfileDb = new AcademicProfileDB(
        rootState.authentication.user.id
      )
      console.clear()
      debugger
      console.log('data', data)
      await academicProfileDb
        .update({ ...data })
        .then(() => commit('updateAcademicProfile', { [data.documentName]: { ...data } }))
        .catch(error => console.error('Error updating the profile', error))
    } catch (error) {
      console.error('triggerUpdateAcademicProfile', error)
    }
  },
} // export default
