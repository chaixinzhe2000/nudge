import * as React from 'react';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Platform, SafeAreaView, StyleSheet, TextInput, View, Text, TouchableOpacity, Image, ActionSheetIOS } from 'react-native';
import { useState, useEffect } from 'react';
import * as firebase from 'firebase'
import 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

interface IContact {
	uid: string,
	displayName: string,
	email: string,
	avatar: string
}

export default function NewTaskScreen() {

	const [taskName, setTaskName] = useState("");
	const [extraDetails, setExtraDetails] = useState("");
	const [location, setLocation] = useState("");
	const [priority, setPriority] = useState("medium");
	const [receiverUid, setReceiverUid] = useState("");
	const [contactList, setContactList]: [IContact[], any] = useState([])
	// data stuff
	const [date, setDate]: [Date, any] = useState(new Date());
	const [show, setShow] = useState(true);

	const onChange = (event, selectedDate) => {
		const currentDate = selectedDate || date;
		setShow(Platform.OS === 'ios');
		setDate(currentDate);
	};

	const db = firebase.firestore();

	var getContacts = firebase.functions().httpsCallable('getContacts');
	var addTask = firebase.functions().httpsCallable('addTask');

	useEffect(() => {
		async function getContactsCaller() {
			let contactResponse = await getContacts();
			if (contactResponse.data.status) {
				setContactList(contactResponse.data.contacts)
			}
		}
		getContactsCaller();
	}, [])

	async function handleSubmit() {
		const user = firebase.auth().currentUser;

		if (user) {
			const toSend = {
				taskName: taskName,
				due: date,
				location: location,
				priority: priority,
				receiverUid: receiverUid,
				extraDetails: extraDetails
			}
			console.log(toSend);
			addTask(toSend)
			.then((res) => {
				console.log(res)
			})
			.catch(console.log);
		} else {
			alert('Not logged in, please login again.');
		}
	}

	const handleSelectContact = (uid: string) => {
		setReceiverUid(uid);
		console.log(receiverUid);
	}

	const contactListElement = contactList.map((contact: IContact) =>
		<TouchableOpacity onPress={() => { handleSelectContact(contact.uid) }} key={contact.uid}>
			<Text>{contact.displayName}</Text>
			<Image
				style={styles.profileImage}
				source={{ uri: contact.avatar ? contact.avatar : 'https://i.pinimg.com/originals/5d/70/18/5d70184dfe1869354afe7bf762416603.jpg' }}
			/>
		</TouchableOpacity>
	)

	const onPress = () =>
		ActionSheetIOS.showActionSheetWithOptions(
			{
				options: ["Cancel", "Low", "Medium", "High"],
				destructiveButtonIndex: 3,
				cancelButtonIndex: 0,
			},
			buttonIndex => {
				if (buttonIndex === 0) {
					setPriority('medium')
				} else if (buttonIndex === 1) {
					setPriority('low');
				} else if (buttonIndex === 2) {
					setPriority('medium');
				} else {
					setPriority('high')
				}
			}
		);

	return (
		<SafeAreaView style={styles.mainContainer}>
			<TextInput
				style={styles.taskName}
				onChangeText={setTaskName}
				placeholder="Enter task name"
				placeholderTextColor="#2cb9b0"
				value={taskName}
			/>
			<View>
				<Text>List of Contacts</Text>
				<View style={styles.contactList}>
					{contactListElement}
				</View>

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
				<Button onPress={onPress} title="Set Priority" />
				<Text>Select Due Date: </Text>
				<DateTimePicker
					testID="dateTimePicker"
					value={date}
					mode={'datetime'}
					display="default"
					onChange={onChange}
				/>

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
		justifyContent: 'flex-start',
		marginLeft: 15
	},
	taskName: {
		height: 40,
		width: '90%',
		fontSize: 20,
		marginTop: 20,
		color: 'black',
		fontWeight: '700'
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
	contactList: {
		display: 'flex',
		flexDirection: 'row'
	}
});
