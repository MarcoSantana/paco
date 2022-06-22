// Syncs the events collection with the user-event

const functions = require('firebase-functions')
const { firestore } = require('firebase-admin')

const userEventTrigger = functions.firestore.document(
  'users/{userId}/events/{eventId}'
)

const serverTimestamp = firestore.FieldValue.serverTimestamp()

exports.syncEvents = userEventTrigger.onCreate(async (_, context) => {
  const userId = context.params.userId
  const eventId = context.params.eventId
  functions.logger.log(`Syncing event ${eventId} to user ${userId}`)
  // const userEvent = change.data()

  await firestore().collection('logs').doc('users').collection('requests').add({
    [userId]: 'Requested to join event',
    createTimestamp: serverTimestamp,
  })
    const event = await firestore()
      .collection('events')
      .doc(eventId)
      .collection('users')
      .get()
    const eventData = event.data()
    const eventUsers = eventData.users

  functions.logger.log('eventData', eventData)
    const userIndex = eventUsers.findIndex(user => user.id === userId)
    if (userIndex === -1) {
      eventUsers.push(userEvent)
    } else {
      eventUsers[userIndex] = userEvent
    }
    await firestore()
      .collection('events')
      .doc(eventId)
      .collection('users')
      .add({userId})
      // .update({ users: eventUsers })
})
