import * as functions from "firebase-functions";
// import * as firebase from "firebase";
import * as admin from "firebase-admin";
// import * as Notifications from 'expo-notifications';
// import { Expo } from 'expo-server-sdk';

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
    let listOfContacts = [];
    const contactList = doc.get("contacts");
    for (let i = 0; i < contactList.length; i++) {
      const contactDoc = await db.collection("User").doc(contactList[i].uid).get();
      listOfContacts.push(contactDoc.data());
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
	  due: number,
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


  // // EXPO NOTIFICATIONS:
  // // Create a new Expo SDK client
  // // optionally providing an access token if you have enabled push security
  // let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
  // const toSend = {
  //     to: receiverDoc.get("messageToken"),
  //     sound: 'default',
  //     body: 'This is a test notification',
  //     data: { withSome: 'data' },
  // };
  // let notifications = [toSend];
  // expo.sendPushNotificationsAsync(notifications)

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


exports.getReceivedTasks = functions.https.onCall(async (data, context) => {
  
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

	// verify receiverUid exists
  const receivedTasksRef = db.collection("Task").where("receiverUid", "==", uid);
	const snapshot = await receivedTasksRef.get();
	if (snapshot.empty) {
		return ({
			status: true,
      tasks: new Map(),
      listOfSenders: [],
			reason: "receiver has no new tasks"
		});
	}
  let tasksBySenderMap = new Map();
  let listOfSenderIds: any[] = [];
  console.log("snapshot")
  console.log(snapshot);
  snapshot.forEach(task => {
    const senderUid = task.get("senderUid");
    if (!tasksBySenderMap.has(senderUid)) {
      tasksBySenderMap.set(senderUid, []);
    }
    tasksBySenderMap.get(senderUid).push(task.data());
    console.log("task data")
    console.log(task.data());
    listOfSenderIds.push(senderUid);
  });


  let listOfSenders = [];
  for (let i = 0; i < listOfSenderIds.length; i++) {
    const senderDoc = await db.collection("User").doc(listOfSenderIds[i]).get();
    listOfSenders.push(senderDoc.data());
    console.log("senderDoc.data()");
    console.log(senderDoc.data());
    console.log("listOfSenders")
    console.log(listOfSenders);
  }


  return ({status: true, tasks: Object.fromEntries(tasksBySenderMap), listOfSenders: listOfSenders});
})


// const sendNotifications = async (expo, messages) => {
//   const chunks = expo.chunkPushNotifications(messages);
//   const tickets = [];
//   for (const chunk of chunks) {
//     try {
//       const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
//       tickets.push(...ticketChunk);
//     } catch (error) {
//       console.error("error sending notifications", error);
//     }
//   }

//   return tickets;
// }

// exports.sendReminders = functions.https.onRequest(async (req, res) => {
//   if (req.method !== 'POST') {
//     res.status(400).send('What are you even doing?');
//     return;
//   }

//   const expo = new Expo();
  
//   // You can either get these tokens from the database
//   // or pass them in your request
//   const tokens: string[] = [];
  
//   const messages = [];
//   for(token of tokens) {
//     if (!Expo.isExpoPushToken(token)) {
//       console.error(`Push token ${token} is not a valid Expo push token`);
//       continue;
//     }
//     messages.push({
//       to: token,
//       title: 'Test Title',
//       body: 'Test body'
//     });
//   }

//   try {
//     await sendNotifications(expo, messages);
//   } catch (error) {
//     console.log('error', error);
//   }

//   res.send(200).send('Notifications sent successfully');
// })
