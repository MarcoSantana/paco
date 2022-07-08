import firebase from 'firebase/app'
import { isNil } from 'lodash'
// import { isNil } from 'lodash'

// import store from '@/store'

// firebase.auth().onAuthStateChanged(firebaseUser => {
//   const actionToDispatch = isNil(firebaseUser) ? 'logout' : 'login'
//   store.dispatch(`authentication/${actionToDispatch}`, firebaseUser)
// })
// import { functions } from 'firebase'
// const functions = require('firebase/functions')

export function callAddAdminRole(email) {
  console.log('adminRole called')
  const adminRole = firebase.functions().httpsCallable('addAdminRole')
  return adminRole({ email })
    .then(result => {
      console.log('result', result)
    })
    .catch(err => {
      console.error(err)
    })
}

export async function callUpdateDocumentStatus(documentId, status, message) {
  const documentStatus = firebase
    .functions()
    .httpsCallable('updateDocumentStatus')
  return documentStatus({ documentId, status, message })
    .then(result => {
      return result
    })
    .catch(err => {
      console.error(err)
    })
}

export async function callUpdateRequestStatus(payload) {
  debugger
  console.log('callUpdateRequestStatus', payload)
  if (isNil(payload)) return { error: 'Error', type: 'error' }
  const requestStatus = firebase
    .functions()
    .httpsCallable('updateRequestStatus')
  return requestStatus(payload)
    .then(result => {
      return result
    })
    .catch(e => {
      console.error(e)
      return {
        error: e,
        type: 'error',
        message: 'error al cambiar el estado de la solicitud',
      }
    })
} // callUpdateRequestStatus

export async function callCreateUserListSheet() {
  const userList = firebase.functions().httpsCallable('createUserListSheet')
  return userList()
    .then(result => {
      return result
    })
    .catch(err => {
      return err
    })
}

export function callChangeDocumentsName() {
  console.log('changing Documents name')
  const changeDocumentsName = firebase
    .functions()
    .httpsCallable('changeDocumentsName')
  return changeDocumentsName()
    .then(result => {
      console.log('result', result)
    })
    .catch(err => {
      console.error(err)
    })
}
