const functions = require('firebase-functions');
// const { } = require('firebase-admin');
const admin = require('firebase-admin')

const authUserTrigger = functions.auth.user()

exports.setup = authUserTrigger.onCreate((user) => {
  setupUser(user)
})

const setupUser = async (user) => {
  await admin.auth().setCustomUserClaims(user.uid, {incomplete: true})
}
