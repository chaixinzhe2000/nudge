import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";
import * as firebase from 'firebase'
import 'firebase/firestore';
import "firebase/functions";
import { Feather } from '@expo/vector-icons';
import { user } from "firebase-functions/lib/providers/auth";
import moment from "moment";

function FeatherIcon(props: { name: React.ComponentProps<typeof Feather>['name']; color: string }) {
	return <Feather size={24} style={{ marginTop: 9, paddingRight: 10 }} {...props} />;
}

function FeatherIconAlt(props: { name: React.ComponentProps<typeof Feather>['name']; color: string }) {
	return <Feather size={22} style={{ marginTop: 3, paddingRight: 5 }} {...props} />;
}

function FeatherIconClose(props: { name: React.ComponentProps<typeof Feather>['name']; color: string }) {
	return <Feather size={22} style={{ marginTop: -2 }} {...props} />;
}

interface ITaskModalProps {
	taskModalOpen: boolean,
	setTaskModalOpen: any,
	selectedTask: any,
	setSelectedTask: any,
	selectedUser: any,
	setSelectedUser: any
}

interface IContact {
	uid: string,
	displayName: string,
	email: string,
	avatar: string
}

export default function TaskModal(props: ITaskModalProps) {
	const user = firebase.auth().currentUser;

	const [newName, setNewName] = useState(user !== null ? user.displayName : "");
	const [contactList, setContactList]: [IContact[], any] = useState([]);

	var getContacts = firebase.functions().httpsCallable('getContacts');

	useEffect(() => {
		if (user) {
			setNewName(user.displayName);
			console.log(user.displayName);
		}
	}, [props.taskModalOpen])

	var task = firebase.functions().httpsCallable('task');

	//   const contactListElement = contactList.map((contact: IContact) =>
	// 		<TouchableOpacity onPress={() => { handleSelectContact(contact.uid, contact.displayName) }} key={contact.uid} style={styles.contactDiv}>
	// 			{/* {console.log(receiverUid)} */}
	// 			{console.log(contact.uid)}
	// 			<View style={styles.imgDiv}>
	// 				<Image
	// 					style={styles.profileImage}
	// 					source={{ uri: contact.avatar ? contact.avatar : 'https://i.pinimg.com/originals/5d/70/18/5d70184dfe1869354afe7bf762416603.jpg' }}
	// 				/>

	// 			</View>
	// 			<Text style={styles.name}>{contact.displayName}</Text>
	// 		</TouchableOpacity>
	// 	)

	async function handleSubmit() {
		const user = firebase.auth().currentUser;

		if (user) {
			await user.updateProfile({ displayName: newName })
				.catch(err => (console.log(err)));
			const toSend = {
				newName: newName,
			}
			task(toSend)
				.then((result) => {
					console.log(result);
					if (result.data.status === false) {
						if (user) {
							setNewName(user.displayName);
						}
						alert('Failed to change name. Please try again.');
						return;
					} else {
						setNewName('');
						props.setTaskModalOpen(false);
					}
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

	const parseDate = (m: any) => {
		const uDate = moment(m).format('MMMM Do YYYY [at] h:mm A');
		const time = moment(m).format('h:mm A');

		const calendar = (moment(m).calendar().split(' at'))[0]
		if (calendar === 'Today') {
			return ('Today at ' + time);
		} else if (calendar === 'Tomorrow') {
			return ('Tomorrow at ' + time);
		} else {
			return (uDate);
		}
	}

	let bColor = props.selectedTask.priority === 'high' ? '#f58822' : '#2cb9b0';
	let dueDate = new firebase.firestore.Timestamp(props.selectedTask.due ? props.selectedTask.due._seconds : 0, props.selectedTask.due ? props.selectedTask.due._nanoseconds : 0).toDate();
	let priorityMessage = (props.selectedTask.priority + ' priority');

	let displayDate = parseDate(dueDate);

	const styles = StyleSheet.create({
		modalContent: {
			flex: 1,
			alignItems: 'flex-start',
			justifyContent: 'flex-start',
			marginTop: 60
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
		taskName: {
			height: 40,
			width: '90%',
			fontSize: 28,
			marginTop: 20,
			color: 'black',
			fontWeight: '700',
			marginLeft: 25
		},
		contactList: {
			display: 'flex',
			flexDirection: 'row'
		},
		name: {
			paddingTop: 8,
			fontSize: 14,
			fontWeight: '500'
		},
		imgDiv: {
			borderRadius: 90,
			padding: 2,
			backgroundColor: 'white',
		},
		nudge: {
			marginLeft: 20,
			fontSize: 18,
			marginTop: 13,
			fontWeight: '600'
		},
		detailsDiv: {
			display: 'flex',
			flexDirection: 'row',
			marginLeft: 20,
			marginTop: 25
		},
		priorityDiv: {
			display: 'flex',
			flexDirection: 'row',
			marginLeft: 20,
			marginTop: 15
		},
		locationDiv: {
			display: 'flex',
			flexDirection: 'row',
			marginLeft: 20,
			marginTop: 10
		},
		details: {
			minHeight: 40,
			maxHeight: 120,
			width: '85%',
			fontSize: 18,
			fontWeight: '600',
			paddingTop: 12,
			padding: 10,
			backgroundColor: '#ededed',
			borderRadius: 10,
			marginRight: 20,
		},

		sentBox: {
			height: 40,
			width: '85%',
			fontSize: 18,
			fontWeight: '600',
			padding: 10,
			paddingLeft: -5,
			backgroundColor: 'white',
			marginRight: 20
		},

		box: {
			height: 40,
			width: '85%',
			padding: 10,
			backgroundColor: '#ededed',
			borderRadius: 10,
			marginRight: 20
		},
		timeBox: {
			height: 40,
			width: '85%',
			padding: 10,
			backgroundColor: 'white',
			borderRadius: 10,
			marginRight: 20
		},
		boxText: {
			fontSize: 18,
			fontWeight: '600',
		},
		contactDiv: {
			marginLeft: 20,
			marginTop: 10,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center'
		},
		profileImage: {
			width: 60,
			height: 60,
			borderRadius: 90
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
			marginTop: 30
		},
		priorityButtonDiv: {
			width: '45%',
			backgroundColor: bColor,
			minHeight: 40,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			flexDirection: 'row',
			borderRadius: 10
		},
		buttonDiv: {
			width: '30%',
			backgroundColor: 'red',
			minHeight: 40,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			flexDirection: 'row',
			borderRadius: 10
		},
		text: {
			color: 'white',
			fontSize: 18,
			fontWeight: '700'
		},
	})

	return (
		<Modal visible={props.taskModalOpen} animationType='slide'>
			<View style={styles.modalContent}>
				<TouchableOpacity onPress={() => props.setTaskModalOpen(false)} >
					<View style={styles.closeButton}>
						<FeatherIconClose name="x" color='#2cb9b0' />
						<Text style={styles.close}>CLOSE</Text>
					</View>
				</TouchableOpacity>
				<Text style={styles.taskName}>{props.selectedTask.taskName}</Text>
				<View style={styles.detailsDiv}>
					<FeatherIcon name="user" color="#2cb9b0" />
					<Text style={styles.sentBox}>{props.selectedUser.displayName}</Text>
					{/* <View style={styles.contactList}>{contactListElement}</View> */}
				</View>
				<View style={styles.priorityDiv}>
					<FeatherIcon name="bell" color="#2cb9b0" />
					<View style={styles.priorityButtonDiv}>
						<Text style={styles.text}>{priorityMessage}</Text>
					</View>
				</View>
				<View style={styles.detailsDiv}>
					<FeatherIcon name="align-left" color="#2cb9b0" />
					<View style={styles.box}>
						<Text style={styles.boxText}>{props.selectedTask.extraDetails}</Text>
					</View>
				</View>
				<View style={styles.locationDiv}>
					<FeatherIcon name="map-pin" color="#2cb9b0" />
					<View style={styles.box}>
						<Text style={styles.boxText}>{props.selectedTask.location}</Text>
					</View>
				</View>
				<View style={styles.locationDiv}>
					<FeatherIcon name="clock" color="#2cb9b0" />
					<View style={styles.timeBox}>
						<Text style={styles.boxText}>{displayDate}</Text>
					</View>
				</View>
				<View style={styles.buttonWrapper}>
					<TouchableOpacity onPress={() => handleSubmit()} style={styles.buttonDiv}>
						<Text style={styles.text}>Cancel Task</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	)
}


