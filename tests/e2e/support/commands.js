// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import firebase, { firestore } from 'firebase'

import 'firebase/firestore'

// const functions = require('firebase-functions')

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAge4gR03bNsbvhOtyRSuw4qtGBgE4pX_U',
  authDomain: 'paco-1a08b.firebaseapp.com',
  //   databaseURL: 'https://paco-1a08b.firebaseio.com',
  databaseURL: 'http://localhost:8081',
  projectId: 'paco-1a08b',
  storageBucket: 'paco-1a08b.appspot.com',
  messagingSenderId: '381096701412',
  appId: '1:381096701412:web:042c016b369cfb651debf1',
  measurementId: 'G-2KQDTHZKH7',
}
firebase.initializeApp(firebaseConfig)

// eslint-disable-next-line no-restricted-globals

const auth = firebase.auth()
// Initialize your Web app as described in the Get started for Web
// Firebase previously initialized using firebase.initializeApp().
// const db = firebase.firestore()

// db.useEmulator('localhost', 8080)
firebase.firestore().settings({
  host: 'localhost:8081',
  ssl: false,
})
// Programatically log in
Cypress.Commands.add('login', (email = 'marco.santana@gmail.com', password = 'A12345678a') => {
  firebase.functions().useFunctionsEmulator('http://localhost:9099')
  // As in so https://stackoverflow.com/questions/64811285/firebase-auth-useemulator-is-not-a-function
  return auth.signInWithEmailAndPassword(email, password)
})

// Programatically log out
Cypress.Commands.add('logout', () => {
  return auth.signOut()
})
