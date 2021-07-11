const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.addAdminRole = functions.https.onCall((data, context) => {
  console.log(context);
  // get user and add custom claim (admin)
  return admin.auth().getUserByEmail(data.email)
      .then((user) => {
        return admin.auth().setCustomUserClaims(user.uid, {admin: true});
      })
      .then(() => {
        return {message: `Success! ${data.email} has been made admin`};
      })
      .catch((error) => {
        return error;
      });
});

// Basic activities log
exports.logActivities = functions.firestore.document("{collection}/{id}")
    .onCreate((snapshot, context) => {
      console.log(snapshot.data());

      const collection = context.params.collection;
      const id = context.params.id;

      const activities = admin.firestore().collection("activities");

      if (collection === "users") {
        return activities.add({text: `Nueva actividad del usuario ${id}`});
      }
      return null;
    });

// Syncs in the admin only documents collection

// TODO block all external (no admin) calls in the collection (use rules)
// TODO format the actual db entry to be useful
// at top level you need the userId and the subcollection id
exports.syncDocuments = functions.firestore
    .document("users/{userId}/forms/{formId}")
    .onCreate((snapshot, context) => {
      console.log(snapshot.data());
      console.log("context.params.userId: ", context.params.userId);
      const userId = context.params.userId;
      const formId = context.params.formId;
      const documents = admin.firestore().collection("forms");
      return documents.add({
        "userId": userId,
        "formId": formId,
        "form": snapshot.data(),
      });
    });


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
