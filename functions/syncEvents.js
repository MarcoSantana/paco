// Syncs the events collection with the user-event

const functions = require("firebase-functions");
const {firestore} = require("firebase-admin");

const userEventTrigger = functions.firestore.document(
    "users/{userId}/events/{eventId}"
);


const serverTimestamp = firestore.FieldValue.serverTimestamp();

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


        const pendingRequestsRef = firestore()
            .collection("counters")
            .doc("pendingRequests");
        const acceptedRequestsRef = firestore()
            .collection("counters")
            .doc("acceptedRequests");
        const rejectedRequestsRef = firestore()
            .collection("counters")
            .doc("rejectedRequests");


        const batch = firestore().batch();

        batch.update(singleEventsUserRef, {
          updateTimestamp: serverTimestamp,
          status: afterStatus,
        });

        batch.update(userEventRef, {
          updateTimestamp: serverTimestamp,
          status: afterStatus,
        });

        batch.set(logsRef, {
          userId,
          eventId,
          description: "Admin set event status to " + afterStatus,
          createTimestamp: serverTimestamp,
        });

        // TODO refactor to be cleaner and dryer
        //
        if (beforeStatus === "pending") {
          batch.update(pendingRequestsRef, {
            count: decrement,
            updateTimestamp: serverTimestamp,
          });
          if (afterStatus === "accepted") {
            batch.update(acceptedRequestsRef, {
              count: increment,
              updateTimestamp: serverTimestamp,
            });
          }
          if (afterStatus === "rejected") {
            batch.update(rejectedRequestsRef, {
              count: increment,
              updateTimestamp: serverTimestamp,
            });
          }
        }

        if (beforeStatus === "accepted") {
          batch.update(acceptedRequestsRef, {
            count: decrement,
            updateTimestamp: serverTimestamp,
          });
          if (afterStatus === "pending") {
            batch.update(pendingRequestsRef, {
              count: increment,
              updateTimestamp: serverTimestamp,
            });
          }
          if (afterStatus === "rejected") {
            batch.update(rejectedRequestsRef, {
              count: increment,
              updateTimestamp: serverTimestamp,
            });
          }
        }

        if (beforeStatus === "rejected") {
          batch.update(rejectedRequestsRef, {
            count: decrement,
            updateTimestamp: serverTimestamp,
          });
          if (afterStatus === "pending") {
            batch.update(pendingRequestsRef, {
              count: increment,
              updateTimestamp: serverTimestamp,
            });
          }
          if (afterStatus === "accepted") {
            batch.update(acceptedRequestsRef, {
              count: increment,
              updateTimestamp: serverTimestamp,
            });
          }
        }

        try {
          await batch.commit();
        } catch (error) {
          functions.logger.error("Unable to update", error);
        }
      } // end if
    });

// TODO trigger to delete event from user's events collection
