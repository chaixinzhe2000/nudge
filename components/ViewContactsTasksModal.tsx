import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Button } from "react-native";
import * as firebase from 'firebase'
import 'firebase/firestore';
import "firebase/functions";
import { Feather } from '@expo/vector-icons';
import IndividualTaskList from "./IndividualTaskList";
import TaskBox from "./TaskBox";
import Dialog from "react-native-dialog";
import { BlurView } from "expo-blur";


function FeatherIcon(props: { name: React.ComponentProps<typeof Feather>['name']; color: string }) {
	return <Feather size={22} style={{ marginTop: -2 }} {...props} />;
}

interface IOtherUser {
	displayName: string,
	uid: string,
	email: string,
	avatar: string
}

interface IViewContactsTasksModalProps {
	addViewContactsTasksModalOpen: boolean,
	setAddViewContactsTasksModalOpen: any,
	selectedContact: IOtherUser
}

export default function ViewContactsTasksModal(props: IViewContactsTasksModalProps) {
	const dbh = firebase.firestore();
	const user = firebase.auth().currentUser;
	const [receivedTasks, setReceivedTasks] = useState([]);
	const [sentTasks, setSentTasks] = useState([])
	const [imageUri, setImageUri] = useState("");
  const [deleteContactDialogOpen, setDeleteContactDialogOpen] = useState(false);
	
  var getTasksWithContact = firebase.functions().httpsCallable('getTasksWithContact');

	useEffect(() => {
		async function getProfileImageCaller() {
			if (user) {
				const userDoc = await dbh.collection("User").doc(user.uid).get();
				setImageUri(userDoc.get("avatar"));
			}
		}
		getProfileImageCaller();
	}, [])

	useEffect(() => {
		async function callGetTasksWithContact() {
			await handleGetTasks();
		}
		callGetTasksWithContact();
	}, [props.addViewContactsTasksModalOpen])


	const TasksGroup = receivedTasks.map((task: any) =>
		<TaskBox key={task.id} priority={task.priority} title={task.taskName} dueDate={new firebase.firestore.Timestamp(task.due._seconds, task.due._nanoseconds).toDate()} />
	)

	const TasksGroupSent = sentTasks.map((task: any) =>
		<TaskBox key={task.id} priority={task.priority} title={task.taskName} dueDate={new firebase.firestore.Timestamp(task.due._seconds, task.due._nanoseconds).toDate()} />
	)

	async function handleGetTasks() {
		const user = firebase.auth().currentUser;

		if (user) {
			// const toSend = {
			//   otherUserUid: props.otherUser.uid,
			//   otherUserEmail: props.otherUser.email,
			//   otherUserDisplayName: props.otherUser.displayName
			// }
			getTasksWithContact(props.selectedContact)
				.then((result) => {
					setReceivedTasks(result.data.receivedFromContact);
					setSentTasks(result.data.sentToContact);
				})
				.catch((error) => {
					// Getting the Error details.
					var code = error.code;
					var message = error.message;
					var details = error.details;
					console.log(code)
					console.log(message)
					console.log(details)
				});
		} else {
			alert('Not logged in, please login again.');
		}

	}

  var deleteContact = firebase.functions().httpsCallable('deleteContact');


  function handleDeleteContact() {
    console.log("hi");
    deleteContact(props.selectedContact)
    .then(() => {
      props.setAddViewContactsTasksModalOpen(false);
      setDeleteContactDialogOpen(false);
      
    })
    .catch((error) => {
      // Getting the Error details.
      var code = error.code;
      var message = error.message;
      var details = error.details;
      console.log(code)
      console.log(message)
      console.log(details)
    });
    
  }

  const blurComponentIOS = (
    <BlurView style={StyleSheet.absoluteFill} blurType="xlight" blurAmount={10} />
  );

	return (
		<Modal visible={props.addViewContactsTasksModalOpen} animationType='slide'>
    <View >
      <Dialog.Container visible={deleteContactDialogOpen} blurComponentIOS={blurComponentIOS}>
        <Dialog.Title>Account delete</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to delete this contact?
        </Dialog.Description>
        <Dialog.Button label="Cancel" onPress={() => setDeleteContactDialogOpen(false)} />
        <Dialog.Button label="Delete" onPress={() => handleDeleteContact()} />
      </Dialog.Container>
    </View>
			<View style={styles.modalContent}>
				<TouchableOpacity onPress={() => props.setAddViewContactsTasksModalOpen(false)} >
					<View style={styles.closeButton}>
						<FeatherIcon name="x" color='#2cb9b0' />
						<Text style={styles.close}>CLOSE</Text>
					</View>
				</TouchableOpacity>
				<Text style={styles.convo}>Conversation with</Text>
				<Text style={styles.convoName}>{props.selectedContact.displayName}</Text>
				<View style={styles.viewContainer}>
					<Image
						style={styles.profileImage}
						source={{ uri: props.selectedContact.avatar }}
					/>
					<View style={styles.taskListFrom}>
						<Text style={styles.name}>{props.selectedContact.displayName}</Text>
						{firebase.auth().currentUser ? TasksGroup : ''}
					</View>
				</View>

				<View style={styles.viewContainer}>
					<Image
						style={styles.profileImage}
						source={{ uri: imageUri}}
					/>
					<View style={styles.taskListTo}>
						<Text style={styles.name}>{firebase.auth().currentUser?.displayName}</Text>
						{firebase.auth().currentUser ? TasksGroupSent : ''}
					</View>
				</View>
				<View style={styles.buttonWrapper}>
					<TouchableOpacity onPress={() => setDeleteContactDialogOpen(true)} style={styles.deleteButton}>
						<Text style={styles.text}>Remove Contact</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	modalContent: {
		flex: 1,
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		marginTop: 60,
	},
	closeButton: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		width: '100%',
		paddingRight: 20
	},
	close: {
		fontSize: 16,
		fontWeight: '700'
	},
	convo: {
		marginTop: 25,
		marginLeft: 20,
		fontSize: 32,
		fontWeight: '600',
	},
	convoName: {
		marginLeft: 20,
		fontSize: 32,
		fontWeight: '700',
		color: '#2cb9b0',
		marginBottom: 25
	},
	inputDiv: {
		display: 'flex',
		flexDirection: 'column',
		marginLeft: 25,
		width: '100%',
		marginTop: 40,
		minHeight: 140
	},
	input: {
		height: 40,
		width: '88%',
		marginTop: 15,
		backgroundColor: '#ededed',
		borderRadius: 10,
		minHeight: 50,
		fontSize: 18,
		paddingLeft: 20,
		fontWeight: '600',
	},
	title: {
		fontWeight: '700',
		fontSize: 22,
		paddingLeft: 8
	},
	subtitle: {
		fontWeight: '700',
		fontSize: 15,
		paddingTop: 8,
		paddingLeft: 8,
		color: '#2cb9b0'
	},
	buttonWrapper: {
		display: 'flex',
		alignItems: 'center',
		width: '100%',
		height: 50,
		marginTop: 20
	},
	deleteButton: {
		backgroundColor: '#e93342',
		minHeight: 40,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		borderRadius: 10,
		padding: 10,
	},
	buttonDiv: {
		backgroundColor: '#2cb9b0',
		display: 'flex',
		flex: 1,
		width: '88%',
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		color: 'white',
		fontSize: 18,
		fontWeight: '700',
	},
	profileImage: {
		width: 55,
		height: 55,
		marginRight: 10,
		borderRadius: 90
	},
	name: {
		fontWeight: '600',
		fontSize: 17
	},
	viewContainer: {
		marginBottom: 85,
		width: '100%',
		justifyContent: "center",
		alignItems: "flex-start",
		display: "flex",
		flexDirection: "row",
		paddingLeft: 10,
		paddingRight: 10
	},
	taskListFrom: {
		flex: 1,
	},
	taskListTo: {
		flex: 1,
	},
	taskBox: {
		maxHeight: 30
	}
})

