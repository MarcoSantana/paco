const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { firestore } = require('firebase-admin');




const authUserTrigger = functions.auth.user()

exports.userSignup = authUserTrigger.onCreate((user) => {
  functions.logger('Adding user')
  functions.logger('user email', user.email)
  functions.logger('user displayName', user.displayName)
  // storeUser(user)
})


exports.userDelete = authUserTrigger.onDelete((user) => {
  functions.logger('Deleting user')
  functions.logger('user email', user.email)
  functions.logger('user displayName', user.displayName)
  // storeUser(user)
})



async function storeUser(user) {
  functions.logger('user', user)
  await admin.firestore
    .collection('logs')
    .doc('users')
    .collection('signup')
    .set({
      user: user,
      createTimestamp: firestore.FieldValue.serverTimestamp()
    }, { merge: true })
};
