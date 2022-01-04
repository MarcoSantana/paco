import UserDB from '@/firebase/user-db'

export default {
  // TODO getUserData(){}

  updateUser: async ({ commit, rootState }, data) => {
    // if (getters.isUserUpdatePending(rootState.authentication.user.id)) return
    const userDb = new UserDB(rootState.authentication.user.id)
    commit('setUserUpdatePending', rootState.authentication.user.id, true)
    const currentUser = userDb.update(data)
    commit('updateUser', currentUser)
    commit('setUserUpdatePending', rootState.authentication.user.id, false)
  },
}
