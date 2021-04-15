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
      reason: "no auth"
    });
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

exports.getContacts = functions.https.onCall(async (data, context) => {
  let uid;
  if (!context.auth) {
    return ({
      status: false,
      reason: "no auth"
    }
    );
  } else {
    uid = context.auth.uid;
  }
  const db = admin.firestore();
  const currUserRef = db.collection("User").doc(uid);
  const doc = await currUserRef.get();
  if (doc.exists) {
    console.log(doc.get("contacts"));
    let listOfContacts: { uid: string; displayName: string; email: string; avatar: string}[] = [];
    const contactList = doc.get("contacts");
    for (let i = 0; i < contactList.length; i++) {
      const contactDoc = await db.collection("User").doc(contactList[i].uid).get();
      listOfContacts.push({uid: contactList[i].uid, displayName: contactDoc.get("displayName"), email: contactList[i].email, avatar: contactList[i].avatar});
      console.log("current listOfContacts:");
      console.log(listOfContacts);
    }
    return {status: true, contacts: listOfContacts};
  } else {
    return {status: false, contacts: null};
  }
})

exports.addTask = functions.https.onCall(async (data, context) => {
	/* data: {
	  taskName: string,
    extraDetails: string,
	  due: date,
	  location: string,
	  priority: string,
	  receiverUid: string
	}*/

	/* send response/put in database: {
	  taskName: string,
	  location: string,
	  due: date,
	  priority: string,
	  receiverUid: uid,
  
	  completionStatus: string,
	  timeCreated: date,
	  senderUid: uid,
	  followUps: followUpIds[]
	}*/
	let taskName;
	let extraDetails;
	let due;
	let location;
	let priority;
	let senderUid;
	let receiverUid;

	if (!context.auth) {
		return ({
			status: false,
			reason: "no auth"
		});
	} else {
		taskName = data.taskName;
		extraDetails = data.extraDetails;
		due = new Date(data.due);
		location = data.location;
		priority = data.priority;
		senderUid = context.auth.uid;
		receiverUid = data.receiverUid;
	}
	// uid = data.uid;
	// userEmail = data.email;
	const db = admin.firestore();

	// verify receiverUid exists
	const receiverRef = db.collection("User").doc(receiverUid);
	const receiverDoc = await receiverRef.get();
	if (!receiverDoc.exists) {
		return ({
			status: false,
			reason: "receiver uid does not map to real user."
		});
	}

	// fill in other fields:
	// completionStatus: string,
	// timeCreated: date,
	// sender: uid,
	// followUps: followUpIds[]
	const newTaskDoc = {
		taskName: taskName,
		extraDetails: extraDetails,
		location: location,
		due: due,
		priority: priority,
		receiverUid: receiverUid,
		completionStatus: "not started",
		seen: "not seen yet",
		timeCreated: admin.firestore.Timestamp.fromDate(new Date()),
		senderUid: senderUid,
		followUps: []
	}
	const addTaskRes = await db.collection("Task").add(newTaskDoc);
	console.log(addTaskRes);
	return {
		status: true,
		addTaskRes: addTaskRes,
	};
});

exports.changeName = functions.https.onCall(async (data, context) => {
  const newName = data.newName;
  let uid;
  if (!context.auth) {
    return ({
      status: false,
      reason: "no auth"
    });
  } else {
    uid = context.auth.uid;
  }
  // uid = data.uid;
  // userEmail = data.email;
  const db = admin.firestore();
  const userRef = db.collection("User").doc(uid);
  const updateRes = await userRef.update({ displayName: newName })
  console.log(updateRes);
  return {
    status: true,
  };
});
