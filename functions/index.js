const { find } = require("lodash");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { google } = require("googleapis");
const { firestore } = require("firebase-admin");

admin.initializeApp();

exports.licenseAPI = require("./licenseCheck");
exports.logging = require("./logging");
exports.deleteUsers = require("./deleteUsers");
exports.syncEvents = require("./syncEvents");

// Gives admin privileges to give user by email
exports.addAdminRole = functions.https.onCall((data, context) => admin
  .auth()
  .getUserByEmail(data.email)
  .then((user) => admin.auth().setCustomUserClaims(user.uid, { admin: true }))
  .then(() => ({ message: `Success! ${data.email} has been made admin` }))
  .catch((error) => error));

async function updateRegisteredUserCount(delta) {
  await admin
    .firestore()
    .collection("counters")
    .doc("registeredUsers")
    .set(
      {
        count: firestore.FieldValue.increment(delta),
        updateTimestamp: firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
}

const authUserCountTrigger = functions.auth.user();
exports.incrementUsersCounter = authUserCountTrigger.onCreate(() => updateRegisteredUserCount(+1));
exports.decrementUsersCounter = authUserCountTrigger.onDelete(() => updateRegisteredUserCount(-1));

// Update document status
exports.updateDocumentStatus = functions.https.onCall((data, context) => {
  try {
    return admin
      .firestore()
      .collection("documents")
      .doc(data.documentId)
      .update({ status: data.status, message: data.message })
      .then(() => ({
        type: "info",
        message: "Estado actualizado",
      }));
  } catch (error) {
    return {
      type: "error",
      message: `Error al actualizar estado. Error: ${error}`,
    };
  }
});

// Update request status
exports.updateRequestStatus = functions.https.onCall((data, context) => {
  try {
    return admin
      .firestore()
      .collection("events")
      .doc(data.requestId)
      .collection("users")
      .doc(data.userId)
      .update({
        status: data.status,
        message: data.message,
        updateTimestamp: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => ({
        type: "success",
        message: "Estado actualizado",
      }));
  } catch (error) {
    return {
      type: "error",
      message: `Error al actualizar estado. Error: ${error}`,
    };
  }
});

// Delete UserRequest
exports.deleteUserRequest = functions.https.onCall((data) => admin
  .firestore()
  .collection("events")
  .doc(data.requestId)
  .collection("users")
  .doc(data.userId)
  .delete()
  .then(() => ({
    type: "success",
    message: "Estado actualizado",
  }))
  .catch((e) => ({
    error: e,
    message: `Error al actualizar estado. Error: ${error}`,
    type: "error",
  }))); // deleteUserRequest

// TODO Refactor deleteUserRequest to separate file
// TODO create a trigger that deletes the event for the user
// TODO create a trigger that deletes the related documents on user/event delete and remove from storage

// FIXME must create actual useful logs not just print to the same db entry
// Basic activities log
// exports.logActivities = functions.firestore.document("{collection}/{id}")
//     .onCreate((snapshot, context) => {
//

//       const collection = context.params.collection;
//       const id = context.params.id;

//       const activities = admin.firestore().collection("activities");

//       if (collection === "users") {
//         return activities.add({text: `Nueva actividad del usuario ${id}`});
//       }
//       return null;
//     });

// Updates the user-document document with the new added status and message
exports.docStatus = functions.firestore
  .document("documents/{documentId}")
  .onUpdate((snapshot, context) => {
    //
    // const userDocRef = snapshot.data().ref;
    const userDoc = admin
      .firestore()
      .collection("users")
      .doc(context.userId)
      .collection("documents")
      .doc(context.documentId);
    userDoc
      .update({
        status: context.status,
        deletedTimestamp: context.deletedTimestamp,
        updateTimestamp: admin.firestore().FieldValue.serverTimestamp(),
      })
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
    // functions.logger.log("change before");
    // functions.logger.log(change.before);
    // functions.logger.log(change.before.data);
    // functions.logger.log("previousValue");
    // functions.logger.log(previousValue);
    // functions.logger.log("newValue");
    // functions.logger.log(newValue);
    // Find the document inside the user-events collection
    // admin
    //   .firestore()
    //   .collection("users")
    //   .doc(previousValue.userId)
    //   .collection("events")
    //   .get()
    //   .then((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //       functions.logger.log(doc.id, " => ", doc.data());
    //       const res = find(doc.data(), (event) => {
    //         if (
    //           event.documents[previousValue.documentName].documentId === previousValue.documentId
    //         ) return true;
    //         return false;
    //       }); // find
    //       functions.logger.log("res", res);
    //     });
    //   });
    // current dev

    // TODO create document url
    const userDoc = admin
      .firestore()
      .collection("users")
      .doc(previousValue.userId)
      .collection("documents")
      .doc(previousValue.documentId);
    userDoc
      .update({
        status: newValue.status,
        message: newValue.message,
      })
      .then(() => {
        const userRef = admin
          .firestore()
          .collection("users")
          .doc(previousValue.userId);
        return userRef.get().then((snapshot) => snapshot.data());
      })
      .then((userData) => {
        admin
          .firestore()
          .collection("mail")
          .add({
            to: "marco.santana@gmail.com",
            cc: userData.email,
            message: {
              subject: `Documento ${previousValue.name} cambio de estado`,
              // eslint-disable-next-line max-len
              html: `El documento: ${previousValue.name} ha cambiado de estado.  Por favor ingrese a la aplicación PAD para verificarlo. <div>${newValue.message}</div>`,
            },
          });
      });

    functions.logger.log("previousValue");
    functions.logger.log(previousValue);

    // Find the document inside the user-events collection
    admin
      .firestore()
      .collection("users")
      .doc(previousValue.userId)
      .collection("events")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          functions.logger.log(doc.id, " => ", doc.data());
          // const res = find(doc.data(), (event) => {
          //   if (
          //     event.documents[previousValue.documentName].documentId === previousValue.documentId
          //   ) return true;
          //   return false;
          // }); // find
          // functions.logger.log("res", res);
        });
      });
    // current dev


    return userDoc;
  });

// Syncs in the admin only documents collection
// TODO Block user deleting/updating documents in rules
// TODO add try/catch and report to the log in db
exports.syncDocuments = functions.firestore
  .document("users/{userId}/documents/{documentId}")
  .onCreate((snapshot, context) => {
    const { userId } = context.params;
    const userRef = admin.firestore().collection("users").doc(userId);
    return userRef
      .get()
      .then((userSnapshot) => userSnapshot.data())
      .then((res) => {
        const userDoc = res;

        const { documentId } = context.params;
        const documents = admin.firestore().collection("documents");
        return documents.add({
          userId,
          userName: userDoc.displayName,
          documentId,
          createTimestamp: snapshot.data().createTimestamp,
          name: snapshot.data().name,
          data: snapshot.data(),
          status: 1,
          ref: `users/${userId}/documents/${documentId}`,
        });
      })
      .then((docs) => docs);
  });

// When a document is deleted by admin the user's document is also deleted
exports.syncDeleteDocuments = functions.firestore
  .document("documents/{documentId}")
  .onDelete((snapshot) => {
    // const userId = snapshot.data().userId;
    const { userId } = snapshot.data();
    const { documentId } = snapshot.data();
    // create a transaction to delete the document
    // this transaction must delete the document in th document collection
    // and the user's document and in the events
    const documentsQuery = admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("documents")
      .doc(documentId)
      .delete();
    return documentsQuery;
  });

// googleSheets

// createUserListSheet
exports.createUserListSheet = functions.https.onCall(async (data, context) => {
  const auth = await google.auth.getClient({
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/devstorage.read_only",
    ],
  });
  // const spreadsheetId = "16LOr6OdFbMrbNfj_qHs4L0_xz9Crj36AX4LWJPnLz7E";
  const spreadsheetId = "1SWQUJF_E02V93AWHLNLEalhmaCGFjWItwRy0nt04FFw";
  const sheetsAPI = google.sheets({ version: "v4", auth });
  // const getSheets = sheetsAPI.spreadsheets
  //
  //

  const documents = [];
  // slime
  const previuosExam = new Date(2021, 8, 14);

  await admin
    .firestore()
    .collection("documents")
    .where("status", "==", 4)
    .where("createTimestamp", ">", previuosExam)
    .orderBy("createTimestamp")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const { userName } = doc.data();
        const { userId } = doc.data();
        const { request } = doc.data().data;
        const { college } = doc.data().data.request.postgraduate || {};
        const { collegeId } = college || "Missing";
        const { hospital } = doc.data().data.request.postgraduate || {};
        let graduationDate = doc.data().data.request.postgraduate.graduationDate || Date.now();
        graduationDate = new Date(graduationDate).getFullYear().toString();

        // const docData = doc.data()
        const { user } = doc.data().data;
        const { firstName } = user;
        const { lastName1 } = user;
        const { lastName2 } = user;
        const lastName = `${lastName1} ${lastName2}`;
        const { gender } = user;
        const { email } = user.contact;
        const { telephone } = user.contact;
        const { cellphone } = user.contact;

        if (userName != null && userName.length > 0) {
          documents.push([
            firstName,
            lastName,
            hospital,
            email,
            graduationDate,
            telephone,
            cellphone,
            foo,
          ]);
        }
      });
    });
  await sheetsAPI.spreadsheets.values.append(
    {
      auth,
      spreadsheetId,
      range: "Sheet1!A2:L2",
      valueInputOption: "RAW",
      requestBody: { values: documents, majorDimension: "ROWS" },
    },
    {},
  );
  return documents;
  // const payload = {
  //   auth,
  //   spreadsheetId,
  //   valueInputOption: "RAW",
  //   range: 'foo!A2:K',
  //   insertDataOption: 'INSERT_ROWS',
  //   resource: {
  //     majorDimension: "ROWS",
  //     values: finalDocs
  //   }
  // }
  // sheetsAPI.spreadsheets.values.append(payload, (err, response) => {
  //   if (err) {
  //
  //   } else {
  //
  //     resolve();
  //   }
  //   // foo
  // })
  // return numRows;
  // try {
  //   const documents = [];

  //   return admin.firestore()
  //       .collection("documents")
  //       .where("status", "==", 4)
  //       .get()
  //       .then((querySnapshot) => {
  //         querySnapshot.forEach((doc) => {
  //
  //           documents.push(doc.data());
  //         });
  //         return documents;
  //       })
  //       .then(documents );
  // } catch (error) {
  //   const message = {};
  //   message.text = "Error al procesar socilicitud";
  //   message.type = "error";
  //   return message;
  // }
});
