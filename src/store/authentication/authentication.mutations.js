export default {
  setUser: (state, value) => (state.user = value),
  setUserClaims: (state, value) => {
    console.log('setUserClaims mutattion', value)
    state.userClaims = value
  },
}
