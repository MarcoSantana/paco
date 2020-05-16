export default {
  setNetworkOnline: (state, value) => (state.networkOnLine = value),
  setSWRegistrationForNewContent: (state, value) => (state.SWRegistrationForNewContent = value),
  setShowAddToHomeScreenModalForApple: (state, value) => (state.showAddToHomeScreenModalForApple = value),
  setRefreshingApp: (state, value) => (state.refreshingApp = value),
  setLoading: state => {
    state.loading = true
  },
  unsetLoading: state => {
    state.loading = false
  },
}
