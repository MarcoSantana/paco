import UserDB from '@/firebase/user-db'

export default {
  createUserProfile: async ({ rootState, commit }, data) => {
    const userDB = new UserDB(rootState.authentication.user.id)
    commit('setUserUpdatePending', data.id, true)
    await userDB.update(data)
    commit('setUserUpdatePending', data.id, false)
  },
  // TODO getUserData(){}
  updateUser: async ({ rootState }, data) => {
    // if (getters.isUserUpdatePending(rootState.authentication.user.id)) return
    // const userDb = new UserDB(data.id)
    const userDb = new UserDB(rootState.authentication.user.id)
    // comit('setUserUpdatePending', data.id, true)
    userDb.update(data)
    // comit('setUserUpdatePending', data.id, false)
  },
}
