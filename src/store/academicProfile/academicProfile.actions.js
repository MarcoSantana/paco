import AcademicProfileDB from '@/firebase/academicProfile-db'

export default {
  /**
   * Fetch academicProfile of current loggedin user
   */
  getAcademicProfile: async ({ rootState, commit }) => {
    const academicProfileDb = new AcademicProfileDB(rootState.authentication.user.id)

    const academicProfile = await academicProfileDb.read(rootState.authentication.user.id)
    commit('setAcademicProfile', academicProfile)
  },
} // export default
