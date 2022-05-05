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
  userClaims: state => {
    console.log('state.claims', state.claims)
    if (isNil(state.user.claims)) {
      return auth().currentUser.getIdTokenResult().then((idTokenResult) => {
        console.log('idTokenResult', idTokenResult)
        // commit('setUserClaims', idTokenResult)
        state.userClaims = idTokenResult.claims
        return idTokenResult.claims
      })
    }
    return state.userClaims
  },
}
