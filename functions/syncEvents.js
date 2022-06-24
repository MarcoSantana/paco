// Syncs the events collection with the user-event

const functions = require("firebase-functions");
const {firestore} = require("firebase-admin");

const userEventTrigger = functions.firestore.document(
    "users/{userId}/events/{eventId}"
);


const serverTimestamp = firestore.FieldValue.serverTimestamp();
const updateTimestamp = serverTimestamp;
const createTimestamp = serverTimestamp;

const increment = firestore.FieldValue.increment(1);
const decrement = firestore.FieldValue.increment(-1);

exports.createEvent = userEventTrigger.onCreate(async (change, context) => {
  const {eventId, userId} = context.params;
  const {before} = change;

  await firestore()
      .collection("counters")
      .doc("pendingRequests")
      .update({count: increment});

  await firestore()
      .collection("logs").doc("users").collection("requests").add({
        userId,
        eventId,
        description: "join event",
        createTimestamp: serverTimestamp,
      });

  await firestore()
      .collection("events")
      .doc(eventId)
      .collection("users")
      .doc(userId)
      .set({
        createTimestamp: serverTimestamp,
        userId,
        status: "pending",
      });

  await firestore()
      .collection("counters")
      .doc("pendingRequests")
      .update({
        count: increment,
      });

  await firestore()
      .collection("users")
      .doc(userId)
      .collection("events")
      .doc(eventId)
      .update({
        updateTimestamp: serverTimestamp,
        status: "pending",
      });
});


const eventTrigger = functions
    .firestore
    .document("events/{eventId}/users/{userId}");
exports.updateEventStatus = eventTrigger
    .onUpdate(async (change, context) => {
      const {eventId, userId} = context.params;
      const {before, after} = change;
      const beforeStatus = before.data().status;
      const afterStatus = after.data().status;


      if (afterStatus !== beforeStatus) {
        const singleEventsUserRef = firestore()
            .collection("events")
            .doc(eventId)
            .collection("users")
            .doc(userId);

        const userEventRef = firestore()
            .collection("users")
            .doc(userId)
            .collection("events")
            .doc(eventId);

        const logsRef = firestore()
            .collection("logs")
            .doc("users")
            .collection("requests")
            .doc();

        const batch = firestore().batch();

        batch.update(singleEventsUserRef, {
          updateTimestamp,
          status: afterStatus,
        });

        batch.update(userEventRef, {
          updateTimestamp,
          status: afterStatus,
        });

        batch.set(logsRef, {
          userId,
          eventId,
          description: "Admin set event status to " + afterStatus,
          createTimestamp,
        });

        const counterRef = (doc) => firestore()
            .collection("counters")
            .doc(`${doc}Requests`);

        const setCounter = (delta) => firestore.FieldValue.increment(delta);

        const updateCounters = (beforeStatus, afterStatus) => {
          batch.update(counterRef(beforeStatus), {
            count: setCounter(-1),
            updateTimestamp,
          });
          batch.update(counterRef(afterStatus), {
            count: setCounter(1),
            updateTimestamp,
          });
        };
        updateCounters(beforeStatus, afterStatus);


        try {
          await batch.commit();
        } catch (error) {
          functions.logger.error("Unable to update", error);
        }
      } // end if
    });

// TODO trigger to delete event from user's events collection
