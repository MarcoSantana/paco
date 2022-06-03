import AcademicProfileDB from '@/firebase/academicProfile-db'
import { isNil } from 'lodash'

export default {
  /**
   * Fetch academicProfile of current loggedin user
   */
  getAcademicProfile: async ({ rootState, commit }) => {
    const academicProfileDb = new AcademicProfileDB(rootState.authentication.user.id)

    const academicProfile = await academicProfileDb.read(rootState.authentication.user.id)
    commit('setAcademicProfile', academicProfile)
  },

  triggerUpdateAcademicProfile: async ({ rootState, commit }, data) => {
    if (isNil(data)) return
    const academicProfileDb = new AcademicProfileDB(rootState.authentication.user.id)
    console.log('academicProfileDb', academicProfileDb)
    try {
      academicProfileDb.update({ ...data }).then(() => commit('updateAcademicProfile', data))
    } catch (error) {
      console.error('triggerUpdateAcademicProfile', error)
    }
  },
} // export default
