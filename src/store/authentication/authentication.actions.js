import router from '@/router'
import { isNil } from 'lodash'
import { auth } from 'firebase'
import { createNewUserFromFirebaseAuthUser } from '@/misc/helpers'
import UsersDB from '@/firebase/users-db'
// import asyncFirestore from '@/firebase/async-firestore'

export default {
  /**
   * Callback fired when user login
   */
  login: async ({ commit, dispatch }, firebaseAuthUser) => {
    const userFromFirebase = await new UsersDB().read(firebaseAuthUser.uid)

    const user = isNil(userFromFirebase)
      ? await createNewUserFromFirebaseAuthUser(firebaseAuthUser)
      : userFromFirebase

    commit('setUser', user)

    await dispatch('setClaims', firebaseAuthUser)

    // All this actions depend on in the rootState so the must be the last
    dispatch('academicProfile/getAcademicProfile', null, { root: true })
    dispatch('products/getUserProducts', null, { root: true })
    dispatch('documents/getUserDocuments', null, { root: true })
  },

  setClaims: async ({ commit }, user) => {
    if (!isNil(user)) {
      user.getIdTokenResult().then(idTokenResult => {
        if (!isNil(idTokenResult)) {
          commit('setUserClaims', idTokenResult.claims)
          console.log('idTokenResult.claims :>> ', idTokenResult.claims)
        }
      })
    }
  },

  /**
   * Callback fired when user logout
   */
  logout: ({ commit }) => {
    commit('setUser', null)
    commit('setUserClaims', null)
    commit('products/setProducts', null, { root: true })
    commit('documents/setDocuments', null, { root: true })

    const currentRouter = router.app.$route
    if (!(currentRouter.meta && currentRouter.meta.authNotRequired)) {
      router.push('/login')
    }
  },

  resetPassword: async email => {
    if (!isNil(email)) {
      auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          console.log('Password reset mail sent!! :>> ')
        })
        .catch(error => {
          const errorCode = error.code
          const errorMessage = error.message
          console.log('errorCode :>> ', errorCode)
          console.log('errorMessage :>> ', errorMessage)
        })
    }
  },
}
