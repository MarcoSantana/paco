import AcademicProfileDB from '@/firebase/academicProfile-db'
// import { firestore } from 'firebase/app'
import { isNil } from 'lodash'

export default {
  /**
   * Fetch academicProfile of current loggedin user
   */
  // getAcademicProfile: async ({ rootState, commit }) => {
  //   console.log('getAcademicProfile')
  //   console.log('rootState.user.id', rootState.user.id)
  //   const academicProfileDb = new AcademicProfileDB(
  //     rootState.authentication.user.id
  //   )
  //   console.log('academicProfileDb', academicProfileDb)
  //   const academicProfile = await academicProfileDb.read(
  //     null,
  //     rootState.authentication.user.id
  //   )
  //   console.table('academicProfile', academicProfile)
  //   commit('setAcademicProfile', academicProfile)
  // },

  getAcademicProfile: async ({ rootState, commit }) => {
    console.log('getAcademicProfile')
    console.log('rootState', rootState)
    console.log(
      'rootState.authentication.user.id',
      rootState.authentication.user.id
    )

    const academicProfileDb = new AcademicProfileDB(
      rootState.authentication.user.id
    )
    let academicProfile = await academicProfileDb.readAll()
    academicProfile = Object.assign({}, ...academicProfile)

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
        .update(data)
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
