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
      await academicProfileDb
        .create(data, data.documentName)
        .then(() => commit('updateAcademicProfile', data))
        // .then(() => {
        //   // TODO move this to a separated databse class user-profile-db
        //   firestore()
        //     .collection('users')
        //     .doc(rootState.authentication.user.id)
        //     .collection('profile')
        //     .doc(data.documentName)
        //     .set({
        //       ...data,
        //       updateTimestamp: firestore.FieldValue.serverTimestamp(),
        //     })
        //     .then(res => console.log('user-profile-db', res))
        //     .catch(err => console.error('Error in user-profile update', err))
        // })
        .catch(error => console.error('Error updating the profile', error))
    } catch (error) {
      console.error('triggerUpdateAcademicProfile', error)
    }
  },
} // export default
