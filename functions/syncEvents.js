// Syncs the events collection with the user-event

const functions = require("firebase-functions");
const { firestore } = require("firebase-admin");

const userEventTrigger = functions.firestore.document(
  "users/{userId}/events/{eventId}",
); // userEventTrigger

const eventTrigger = functions
  .firestore
  .document("events/{eventId}/users/{userId}"); // event

const serverTimestamp = firestore.FieldValue.serverTimestamp();
const updateTimestamp = serverTimestamp;
const createTimestamp = serverTimestamp;

const increment = firestore.FieldValue.increment(1);
const decrement = firestore.FieldValue.increment(-1);

exports.createEvent = userEventTrigger.onCreate(async (change, context) => {
  const { eventId, userId } = context.params;
  const { before } = change;

  await firestore()
    .collection("counters")
    .doc("pendingRequests")
    .update({ count: increment });

  await firestore()
    .collection("logs").doc("users").collection("requests")
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

// When a user request is deleted from th event-users colelction this is
// triggered to delete the user-event document
exports.deleteRequest = eventTrigger.onDelete(async (change, context) => {
  const { eventId, userId } = context.params;
  await firestore()
    .collection(`users/${userId}/events`)
    .doc(eventId)
    .delete();
  const user = await firestore()
    .collection("users")
    .doc(userId)
    .get()
    .then((data) => data.data());
  firestore()
    .collection("mail")
    .add({
      to: user.email,
      message: {
        subject: "La solicitud de tu evento ha sido cancelada",
        html:
          `<div>
            <h1>La solicitud de tu evento ha sido cancelada</h1>
            <p>
            Si crees que es un error, puedes volver a realizarla mediante PAD.
            </p>
            <p>
            <small>Este es un correo automático generado por PAD.</small>
          </div>`,
      },
    })
    .then(() => {
      firestore()
        .collection("logs/users/requests")
        .add({
          createTimestamp: serverTimestamp,
          userId,
          eventId,
          description:
            "delete request",
        });
    });
}); // deleteEvent

exports.updateEventStatus = eventTrigger
  .onUpdate(async (change, context) => {
    const { eventId, userId } = context.params;
    const { before, after } = change;
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
        description: `Admin set event status to ${afterStatus}`,
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
  }); // updateEventStatus
