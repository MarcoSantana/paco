import { isNil } from 'lodash'
import { auth } from 'firebase'

export default {
  isUserLoggedIn: state => !isNil(state.user),
  // isUserAdmin: state => state.userClaims.admin,
  isUserAdmin: state => {
    if (!isNil(state.userClaims)) {
      console.log('state.user.claims  from getter:>> ', state.userClaims)
      return state.userClaims.admin
    }
    return false
  },
  isUserIncomplete: state => {
    console.log('state.claims', state.claims)
    return state.userClaims.incomplete
  },
  getUserClaims: (state, { commit }) => {
    // console.log('state.claims', state.claims)
    console.log('getUserClaims')
    console.log('state', state)
    if (isNil(state.user.claims)) {
      return auth()
        .currentUser.getIdTokenResult()
        .then(idTokenResult => {
          console.log('idTokenResult', idTokenResult)
          commit('setClaims', idTokenResult.claims)
          return idTokenResult.claims
        })
    }
    return state.userClaims
  },
  getUser: state => ({ ...state.user }),
}
