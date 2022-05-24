import AcademicProfileDB from '@/firebase/academicProfile-db'

export default {
  /**
   * Fetch products of current loggedin user
   */
  getAcademicProfile: async ({ rootState, commit }) => {
    const academicProfileDb = new AcademicProfileDB(rootState.authentication.user.id)

    const academicProfile = await academicProfileDb.readAll()
    commit('setAcademicProfile', academicProfile)
  },
}
