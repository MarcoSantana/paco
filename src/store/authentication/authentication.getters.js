import { isNil } from 'lodash'

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
}
