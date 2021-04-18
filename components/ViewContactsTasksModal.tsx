import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
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
		<TaskBox key={task.id} priority={task.priority} title={task.taskName}
			completionStatus={task.completionStatus}
			dueDate={new firebase.firestore.Timestamp(task.due._seconds, task.due._nanoseconds).toDate()} />
	)

	const TasksGroupSent = sentTasks.map((task: any) =>
		<TaskBox key={task.id} priority={task.priority} title={task.taskName} 
			completionStatus={task.completionStatus}
			dueDate={new firebase.firestore.Timestamp(task.due._seconds, task.due._nanoseconds).toDate()} />
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

	if (receivedTasks.length === 0 && sentTasks.length === 0) {
		return (
			<Modal visible={props.addViewContactsTasksModalOpen} animationType='slide'>
			<View style={styles.modalContent}>
				<TouchableOpacity onPress={() => props.setAddViewContactsTasksModalOpen(false)} >
					<View style={styles.closeButton}>
						<FeatherIcon name="x" color='#2cb9b0' />
						<Text style={styles.close}>CLOSE</Text>
					</View>
				</TouchableOpacity>
				<Text style={styles.convo}>Conversation with</Text>
				<Text style={styles.convoName}>{props.selectedContact.displayName}</Text>
				<View style={{width: '100%', height: '58%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
					<Text style={{fontSize: 18, fontWeight: '500'}}>
						Looks like you have no exchanges
					</Text>
					<Text style={{fontSize: 18, fontWeight: '500'}}>
						with this person yet.
					</Text>
				</View>
				<View style={styles.buttonWrapper}>
					<TouchableOpacity onPress={() => console.log('hi')} style={styles.deleteButton}>
						<Text style={styles.text}>Remove Contact</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
		)
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
				<Text style={styles.convo}>Conversation with</Text>
				<Text style={styles.convoName}>{props.selectedContact.displayName}</Text>
				{ receivedTasks.length === 0 ? 
					<View style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
					</View> : 
				<View style={styles.viewContainer}>
					<Image
						style={styles.profileImage}
						source={{ uri: props.selectedContact.avatar }}
					/>
					<View style={styles.taskListFrom}>
						<Text style={styles.name}>{props.selectedContact.displayName}</Text>
						<ScrollView>
							{firebase.auth().currentUser ? TasksGroup : ''}
						</ScrollView>
					</View>
				</View>
				}

				{ sentTasks.length === 0 ? 
					<View style={{height: '29%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
					</View> :
				<View style={receivedTasks.length === 0 ? styles.viewContainerBottom : styles.viewContainer}>
					<Image
						style={styles.profileImage}
						source={{ uri: imageUri}}
					/>
					<View style={styles.taskListTo}>
						<Text style={styles.name}>{firebase.auth().currentUser?.displayName}</Text>
						<ScrollView>
							{firebase.auth().currentUser ? TasksGroupSent : ''}
						</ScrollView>
					</View>
				</View>
				}
				<View style={styles.buttonWrapper}>
					<TouchableOpacity onPress={() => console.log('hi')} style={styles.deleteButton}>
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
		marginBottom: 35
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
		borderRadius: 10,
		padding: 10,
		marginTop: 50
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
		paddingRight: 10,
		height: '18%'
	},
	viewContainerBottom: {
		marginBottom: 310,
		width: '100%',
		justifyContent: "center",
		alignItems: "flex-start",
		display: "flex",
		flexDirection: "row",
		paddingLeft: 10,
		paddingRight: 10,
		height: '18%'
	},
	taskListFrom: {
		flex: 1,
		height: 200,
	},
	taskListTo: {
		flex: 1,
		height: 200
	}
})

