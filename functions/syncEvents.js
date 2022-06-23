// Syncs the events collection with the user-event

const functions = require('firebase-functions')
const { firestore } = require('firebase-admin')

const userEventTrigger = functions.firestore.document(
  'users/{userId}/events/{eventId}'
)

const serverTimestamp = firestore.FieldValue.serverTimestamp()

exports.syncEvents = userEventTrigger.onCreate(async (_, context) => {
  const {eventId, userId} = context.params

  await firestore()
    .collection('logs').doc('users').collection('requests').add({
    [userId]: 'Requested to join event',
    createTimestamp: serverTimestamp,
  })

  await firestore()
    .collection('events')
    .doc(eventId)
    .collection('users')
    .doc(userId).set({
      createTimestamp: serverTimestamp,
      description: 'Requested to join event',
      userId,
      status: 'pending',
    })

  // update the user's event status to pending
  await firestore()
    .collection('users')
    .doc(userId)
    .collection('events')
    .doc(eventId)
    .set({
      createTimestamp: serverTimestamp,
      status: 'pending',
    })

  // await firestore()
  //   .collection('users')
  //   .doc(userId)
  //   .collection('events')
  //   .doc(eventId)
  //   .update({status: 'pending'})

})
