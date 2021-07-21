const functions = require("firebase-functions");
const admin = require("firebase-admin");
// const {firestore} = require("firebase-admin");

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

// Update document status
exports.updateDocumentStatus = functions.https.onCall((data, context) => {
  try {
    return admin.firestore()
        .collection("documents")
        .doc(data.documentId)
        .update({"status": data.status})
        .then(() => {
          return {
            type: "info",
            message: "Estado actualizado",
          };
        });
  } catch (error) {
    console.log("Error>> ", error);
    return {
      type: "info",
      message: "Estado actualizado",
    };
  }
});


// FIXME must create actual useful logs not just print to the same db entry
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

// Updates the user-document document with the new admin added status
exports.docStatus = functions
    .firestore
    .document("documents/{documentId}")
    .onUpdate((snapshot, context) => {
      // console.log("ref", snapshot.data().ref);
      // const userDocRef = snapshot.data().ref;
      const userDoc = admin.firestore()
          .collection("users")
          .doc(context.userId)
          .collection("documents")
          .doc(context.documentId);
      userDoc.update({status: context.status})
          .then((res) => {
            console.log("res", res);
          });
      return userDoc;
    });

// Test
exports.updateDocStatus = functions.firestore
    .document("documents/{documentId}")
    .onUpdate((change, context) => {
      const newValue = change.after.data();
      const previousValue = change.before.data();
      console.log("previousValue", previousValue);
      const userDoc =
        admin.firestore()
            .collection("users")
            .doc(previousValue.userId)
            .collection("documents")
            .doc(previousValue.documentId);
      userDoc.update({
        status: newValue.status,
      });
      return userDoc;
    });

// Syncs in the admin only documents collection
// TODO Block user deleting/updating documents in rules
// TODO add try/catch and report to the log in db
exports.syncDocuments = functions.firestore
    .document("users/{userId}/documents/{documentId}")
    .onCreate((snapshot, context) => {
      const userId = context.params.userId;
      const userRef = admin.firestore().collection("users").doc(userId);
      return userRef.get()
          .then((userSnapshot) => {
            return userSnapshot.data();
          })
          .then((res) => {
            const userDoc = res;
            console.log("userDoc", userDoc);
            const documentId = context.params.documentId;
            const documents = admin.firestore().collection("documents");
            return documents.add({
              "userId": userId,
              "userName": userDoc.displayName,
              "documentId": documentId,
              "createTimestamp": snapshot.data().createTimestamp,
              "name": snapshot.data().name,
              "data": snapshot.data(),
              "status": 1,
              "ref": `users/${userId}/documents/${documentId}`,
            });
          })
          .then((docs) => docs);
    });

// When a document is deleted by admin the user's document is also deleted
exports.syncDeleteDocuments = functions.firestore
    .document("documents/{documentId}")
    .onDelete((snapshot) => {
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

