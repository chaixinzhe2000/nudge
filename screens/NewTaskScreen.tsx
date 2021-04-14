import * as React from 'react';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Platform, SafeAreaView, StyleSheet, TextInput, View, Text, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect } from 'react';
import * as firebase from 'firebase'
import 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

interface IContact {
	uid: string,
	displayName: string,
	email: string,
	avatar: string
}

export default function NewTaskScreen() {

	const [taskName, setTaskName] = useState("");
	const [extraDetails, setExtraDetails] = useState("");
	const [receiverName, setReceiverName] = useState("");
	const [location, setLocation] = useState("");
	const [priority, setPriority] = useState("");
	const [receiverUid, setReceiverUid] = useState("");
	const [contactList, setContactList]: [IContact[], any] = useState([])
	// data stuff
	const [date, setDate] = useState(new Date());
	const [show, setShow] = useState(true);

	const onChange = (event, selectedDate) => {
		const currentDate = selectedDate || date;
		setShow(Platform.OS === 'ios');
		setDate(currentDate);
	};

	const db = firebase.firestore();

	var getContacts = firebase.functions().httpsCallable('getContacts');

	useEffect(() => {
		async function getContactsCaller() {
		  await getContacts();
		}
		getContactsCaller();
		console.log("contactsList");
	  },[])

	async function handleSubmit() {
		const user = firebase.auth().currentUser;

		if (user) {
			const toSend = {
				taskName: taskName,
				due: date,
				location: location,
				priority: priority,
				receiverUid: receiverUid
			}

		} else {
			alert('Not logged in, please login again.');
		}
	}

	const handleSelectContact = (e) => {
		setReceiverUid(e.target.getAttribute('uid'))
	}


	const contactListElement = contactList.map((contact: IContact) =>
		<TouchableOpacity onPress={e => {handleSelectContact(e)}} key={contact.uid}>
			<Image
				style={styles.profileImage}
				source={{ uri: contact.uid ? contact.uid : 'https://i.pinimg.com/originals/5d/70/18/5d70184dfe1869354afe7bf762416603.jpg' }}
			/>
		</TouchableOpacity>
	)
	return (
		<SafeAreaView style={styles.mainContainer}>
			<TextInput
				style={styles.input}
				onChangeText={setTaskName}
				placeholder="Task Name"
				value={taskName}
			/>
			<View>
				<Text>List of Contacts</Text>
			{contactListElement}
			</View>
			<View>
				<TextInput
					style={styles.input}
					onChangeText={setExtraDetails}
					placeholder="Extra Details"
					value={extraDetails}
				/>
				<TextInput
					style={styles.input}
					onChangeText={setLocation}
					placeholder="Location"
					value={location}
				/>
				<TextInput
					style={styles.input}
					onChangeText={setPriority}
					placeholder="Priority"
					value={priority}
				/>
				<Text>Select Due Date: </Text>
				{show && (
					<DateTimePicker
						testID="dateTimePicker"
						value={date}
						mode={'datetime'}
						display="default"
						onChange={onChange}
					/>
				)}
			</View>
			<Button
				icon={
					<Icon
						name="arrow-right"
						size={15}
						color="white"
					/>
				}
				buttonStyle={styles.submitButton}
				title="Send"
				onPress={() => handleSubmit()}

			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	mainContainer: {
		display: 'flex',
		flex: 1,
		width: '100%',
		justifyContent: 'space-between',
		borderColor: 'blue',
		borderWidth: 3,
	},
	input: {
		height: 40,
		width: '90%',
		margin: 12,
		borderWidth: 1,
		borderColor: 'blue',
	},
	submitButton: {
		width: '90%',
		margin: '5%',
		borderWidth: 1,
		borderColor: 'blue',
	},
	profileImage: {
		width: 55,
		height: 55,
		marginRight: 10,
		borderRadius: 90
	},
});
