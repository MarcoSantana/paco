const functions = require("firebase-functions");
const { firestore } = require("firebase-admin");
const { log } = require("firebase-functions/logger");

const authUserTrigger = functions.auth.user();


exports.deleteOnRemove = authUserTrigger.onDelete((user) => {
  async (user) => {
    return firestore()
      .collection("users")
      .doc(user.uid)
      .delete()
      .then((res) => log(res));
  };
});
