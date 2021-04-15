import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";
import * as firebase from 'firebase'
import 'firebase/firestore';
import "firebase/functions";
import { Feather } from '@expo/vector-icons';
import IndividualTaskList from "./IndividualTaskList";
import TaskBox from "./TaskBox";

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
		<TaskBox key={task.taskName} priority={task.priority} title={task.taskName} dueDate={new firebase.firestore.Timestamp(task.due._seconds, task.due._nanoseconds).toDate()} />
	)

	const TasksGroupSent = sentTasks.map((task: any) =>
		<TaskBox key={task.taskName} priority={task.priority} title={task.taskName} dueDate={new firebase.firestore.Timestamp(task.due._seconds, task.due._nanoseconds).toDate()} />
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

	return (
		<Modal visible={props.addViewContactsTasksModalOpen} animationType='slide'>
			<View style={styles.modalContent}>
				<TouchableOpacity onPress={() => props.setAddViewContactsTasksModalOpen(false)} >
					<View style={styles.closeButton}>
						<FeatherIcon name="x" color='#2cb9b0' />
						<Text style={styles.close}>CLOSE</Text>
					</View>
				</TouchableOpacity>

				<View style={styles.viewContainer}>
					<Image
						style={styles.profileImage}
						source={{ uri: props.selectedContact.avatar }}
					/>
					<View style={styles.taskList}>
						<Text style={styles.name}>{props.selectedContact.displayName}</Text>
						{firebase.auth().currentUser ? TasksGroup : ''}
					</View>
				</View>

				<View style={styles.viewContainer}>
					<Image
						style={styles.profileImage}
						source={{ uri: imageUri}}
					/>
					<View style={styles.taskList}>
						<Text style={styles.name}>{firebase.auth().currentUser?.displayName}</Text>

						{firebase.auth().currentUser ? TasksGroupSent : ''}
					</View>
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
		height: 50
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
		marginBottom: 90,
		width: '100%',
		justifyContent: "center",
		alignItems: "flex-start",
		display: "flex",
		flexDirection: "row",
		paddingLeft: 10,
		paddingRight: 10
	},
	taskList: {
		flex: 1
	},
	taskBox: {
		maxHeight: 30
	}
})

