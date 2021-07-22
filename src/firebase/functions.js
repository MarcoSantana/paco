import firebase from 'firebase/app'
// import { isNil } from 'lodash'

// import store from '@/store'

// firebase.auth().onAuthStateChanged(firebaseUser => {
//   const actionToDispatch = isNil(firebaseUser) ? 'logout' : 'login'
//   store.dispatch(`authentication/${actionToDispatch}`, firebaseUser)
// })
// import { functions } from 'firebase'
// const functions = require('firebase/functions')

export function callAddAdminRole(email) {
  console.log('Click')
  const adminRole = firebase.functions().httpsCallable('addAdminRole')
  adminRole({ email })
    .then(result => {
      console.log('result', result)
    })
    .catch(err => {
      console.error(err)
    })
}

export async function callUpdateDocumentStatus(documentId, status) {
  const documentStatus = firebase.functions().httpsCallable('updateDocumentStatus')
  return documentStatus({ documentId, status })
    .then(result => {
      return result
    })
    .catch(err => {
      console.error(err)
    })
}
