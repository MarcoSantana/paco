// Syncs the events collection with the user-event

const functions = require("firebase-functions");
const { firestore } = require("firebase-admin");

const userEventTrigger = functions.firestore.document(
  "users/{userId}/events/{eventId}",
); // userEventTrigger


const eventTrigger = functions.firestore.document(
  "events/{eventId}/users/{userId}",
); // event

const serverTimestamp = firestore.FieldValue.serverTimestamp();
const updateTimestamp = serverTimestamp;
const createTimestamp = serverTimestamp;

const increment = firestore.FieldValue.increment(1);
const decrement = firestore.FieldValue.increment(-1);

const getStatus = (statusKey) => {
  const status = {
    accepted: { color: "#4CAF50", text: "'aceptada'" },
    pending: { color: "#CDDC39", text: "'pendiente'" },
    rejected: { color: "#FF5722", text: "'rechazada'" },
  };
  return status[statusKey];
};


exports.createEvent = userEventTrigger.onCreate(async (change, context) => {
  const { eventId, userId } = context.params;
  const { before } = change;

  await firestore()
    .collection("counters")
    .doc("pendingRequests")
    .update({ count: increment });

  await firestore().collection("logs").doc("users").collection("requests")
    .add({
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

  await firestore().collection("counters").doc("pendingRequests").update({
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

// When a user request is deleted from th event-users colelction this is
// triggered to delete the user-event document
exports.deleteRequest = eventTrigger.onDelete(async (change, context) => {
  const { eventId, userId } = context.params;
  const after = change.after.data();
  const { message, status } = after.message;
  await firestore().collection(`users/${userId}/events`).doc(eventId).delete();
  const user = await firestore()
    .collection("users")
    .doc(userId)
    .get()
    .then((data) => data.data());
  firestore()
    .collection("mail")
    .add({
      to: user.email,
      cc: "cmmu2009@yahoo.com.mx",
      bcc: "marco.santana@gmail.com",
      template: {
        name: "eventDelete",
        data: {
          message,
          status: getStatus(status).text,
          color: getStatus(status).color,
        },
      },
    })
    .then(() => {
      firestore().collection("logs/users/requests").add({
        createTimestamp: serverTimestamp,
        userId,
        eventId,
        description: "delete request",
      });
    });
}); // deleteEvent

exports.updateEventStatus = eventTrigger.onUpdate(async (change, context) => {
  const { eventId, userId } = context.params;
  const { before, after } = change;
  const beforeStatus = before.data().status;
  const afterStatus = after.data().status;
  const { message, status } = after.data();

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
      description: `Admin set event status to ${afterStatus}`,
      createTimestamp,
    });

    const counterRef = (doc) => firestore().collection("counters").doc(`${doc}Requests`);

    const setCounter = (delta) => firestore.FieldValue.increment(delta);

    const updateCounters = (bStatus, aStatus) => {
      batch.update(counterRef(bStatus), {
        count: setCounter(-1),
        updateTimestamp,
      });
      batch.update(counterRef(aStatus), {
        count: setCounter(1),
        updateTimestamp,
      });
    };
    updateCounters(beforeStatus, afterStatus);

    try {
      await batch.commit()
        .then(() => {
          firestore()
            .collection("mail")
            .add({
              toUids: [userId],
              cc: "cmmu2009@yahoo.com.mx",
              bcc: "marco.santana@gmail.com",
              template: {
                name: "eventStatusChange",
                data: {
                  message,
                  status: getStatus(status).text,
                  color: getStatus(status).color,
                },
              },
            });
        });
    } catch (error) {
      functions.logger.error("Unable to update", error);
    }
  } // end if
}); // updateEventStatus
