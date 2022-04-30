const functions = require('firebase-functions');
const { firestore } = require('firebase-admin');

const authUserTrigger = functions.auth.user()

exports.userSignup = authUserTrigger.onCreate((user) => {
  signUser(user, 'signup')
})

exports.userDelete = authUserTrigger.onDelete((user) => {
  signUser(user, 'signout')
})

async function signUser(user, delta) {
  return firestore()
    .collection('logs')
    .doc('users')
    .collection(delta)
    .add({
      uid: user.uid,
      createTimestamp: firestore.FieldValue.serverTimestamp(),
    }, { merge: true })
    .then(() =>{
      firestore()
        .collection('users')
        .doc(user.uid)
        .update({
          active: delta === 'signup' ? true : false,
        })
    })

};
