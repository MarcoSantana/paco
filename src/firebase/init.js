import firebase from 'firebase/app'
import 'firebase/auth'

// The configuration below is not sensitive data. You can serenely add your config here
// const config = {
//   apiKey: 'AIzaSyCe6CSzOUs6_Ij_VHa6hancdEi6CNBtw7c',
//   authDomain: 'bento-starter.firebaseapp.com',
//   databaseURL: 'https://bento-starter.firebaseio.com',
//   projectId: 'bento-starter',
//   storageBucket: 'bento-starter.appspot.com',
//   messagingSenderId: '458464977217'
// }

const config = {
  apiKey: "AIzaSyAge4gR03bNsbvhOtyRSuw4qtGBgE4pX_U",
  authDomain: "paco-1a08b.firebaseapp.com",
  databaseURL: "https://paco-1a08b.firebaseio.com",
  projectId: "paco-1a08b",
  storageBucket: "paco-1a08b.appspot.com",
  messagingSenderId: "381096701412",
  appId: "1:381096701412:web:042c016b369cfb651debf1",
  measurementId: "G-2KQDTHZKH7"
};

firebase.initializeApp(config)