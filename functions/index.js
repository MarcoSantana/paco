const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.addAdminRole = functions.https.onCall((data, context) => {
  // console.log(context);
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
// exports.logActivities = functions.firestore.document("{collection}/{id}")
//     .onCreate((snapshot, context) => {
//       console.log(snapshot.data());

//       const collection = context.params.collection;
//       const id = context.params.id;

//       const activities = admin.firestore().collection("activities");

//       if (collection === "users") {
//         return activities.add({text: `Nueva actividad del usuario ${id}`});
//       }
//       return null;
//     });

// Syncs in the admin only documents collection
// TODO Block user deleting/updating documents in rules
// TODO use the actual user name
exports.syncDocuments = functions.firestore
    .document("users/{userId}/documents/{documentId}")
    .onCreate((snapshot, context) => {
      const userId = context.params.userId;
      const documentId = context.params.documentId;
      const documents = admin.firestore().collection("documents");
      return documents.add({
        "userId": userId,
        // TODO "userName": userName
        "documentId": documentId,
        "createTimestamp": snapshot.data().createTimestamp,
        "name": snapshot.data().name,
        "data": snapshot.data(),
        "status": 1,
        // "ref": `users/${userId}/documents/${documentId}`,
      });
    });

// When a document is deleted by admin the user's document is also deleted
exports.syncDeleteDocuments = functions.firestore
    .document("documents/{documentId}")
    .onDelete((snapshot, context) => {
      const userId = snapshot.data().userId;
      const documentId = snapshot.data().documentId;
      const documentsQuery = admin.firestore()
          .collection("users")
          .doc(userId)
          .collection("documents")
          .doc(documentId)
          .delete();
      return documentsQuery;
    });


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
