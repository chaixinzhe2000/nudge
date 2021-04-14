import * as functions from "firebase-functions";
// import * as firebase from "firebase";
import * as admin from "firebase-admin";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

admin.initializeApp();

// exports.addMessage = functions.https.onRequest(async (req, res) => {
//   // [END addMessageTrigger]
//     // Grab the text parameter.
//     const original = req.query.text;
//     // [START adminSdkAdd]
//     // Push the new message into Firestore using the Firebase Admin SDK.
//     const writeResult = await admin.firestore().collection('messages').add({original: original});
//     // Send back a message that we've successfully written the message
//     res.json({result: `Message with ID: ${writeResult.id} added.`});
//     // [END adminSdkAdd]
//   });
exports.addContact = functions.https.onCall(async (data, context) => {
  const targetEmail = data.targetEmail;
  let uid;
  let userEmail;
  if (!context.auth) {
    return ({
      status: false,
      targetEmail: targetEmail,
      reason: "no auth"
    }
    );
    
  } else {
    uid = context.auth.uid;
    userEmail = context.auth.token.email;
  }
  // uid = data.uid;
  // userEmail = data.email;
  const db = admin.firestore();

  const targetUsersRef = db.collection("User").where("email", "==", targetEmail);
  const snapshot = await targetUsersRef.get();
  
  if (snapshot.empty) {
    console.log("No matching documents.");
    return {
      status: false,
      targetEmail: targetEmail,
      reason: "no target email"
    };
  } else {
    let targetUserList: any[] = [];
    snapshot.forEach(doc => {
      targetUserList.push(doc.id);
    });
    
    const currUserRef = db.collection("User").doc(uid);
    const addToContactsList = await currUserRef.update({
      contacts: admin.firestore.FieldValue.arrayUnion({ uid: targetUserList[0], email: targetEmail })
    });
    const targetUserRef = db.collection("User").doc(targetUserList[0]);
    const addToTargetContactsList = await targetUserRef.update({
      contacts: admin.firestore.FieldValue.arrayUnion({ uid: uid, email: userEmail })
    });
    console.log(snapshot);
    return {
      status: true,
      addToContactsList: addToContactsList,
      addToTargetContactsList: addToTargetContactsList
    };
  }
});
