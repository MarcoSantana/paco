const functions = require('firebase-functions');
// const { } = require('firebase-admin');
const admin = require('firebase-admin')

const authUserTrigger = functions.auth.user()

exports.setup = authUserTrigger.onCreate((user) => {
  setupUser(user)
})

const setupUser = async (user) => {
  // As the claims are a thing muhc more inmutable by the user
  // we will use a field in the db
  // await admin.auth().setCustomUserClaims(user.uid, {incomplete: true})
  await admin.firestore().collection('users').doc(user.uid).update({ incomplete: true })
}
