import * as React from 'react';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Platform, SafeAreaView, StyleSheet, TextInput, View, Text, TouchableOpacity, Image, ActionSheetIOS, Keyboard, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import * as firebase from 'firebase'
import 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Feather } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


function FeatherIcon(props: { name: React.ComponentProps<typeof Feather>['name']; color: string }) {
	return <Feather size={24} style={{ marginTop: 9, paddingRight: 10 }} {...props} />;
}

function FeatherIconAlt(props: { name: React.ComponentProps<typeof Feather>['name']; color: string }) {
	return <Feather size={22} style={{ marginTop: 3, paddingRight: 5 }} {...props} />;
}

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
	const [priorityButton, setPriorityButton] = useState("Set Priority");
	const [receiveMessage, setReceiveMessage] = useState("Nudge a friend!");
	const [receiverUid, setReceiverUid] = useState("");
	const [contactList, setContactList]: [IContact[], any] = useState([]);
	const [errorMessage, setErrorMessage]: [string, any] = useState("");
	const [searchString, setSearchString]: [string, any] = useState("");
	// data stuff
	let today = new Date()
	let tomorrow = new Date(today)
	tomorrow.setDate(tomorrow.getDate() + 1)
	const [date, setDate]: [Date, any] = useState(tomorrow);
	const [show, setShow] = useState(true);

	const onChange = (event, selectedDate) => {
		const currentDate = selectedDate;
		setShow(Platform.OS === 'ios');
		setDate(currentDate);
	};

	const db = firebase.firestore();

	var getContacts = firebase.functions().httpsCallable('getContacts');
	var addTask = firebase.functions().httpsCallable('addTask');

	//   useEffect(() => {
	// 	  setInterval(() => {console.log(searchString)}, 2000);
	//   }, []);

	function strcmp(str1, str2) {
		return ((str1 === str2) ? 0 : ((str1 > str2) ? 1 : -1));
	}

	useEffect(() => {
		async function getContactsCaller() {
			let contactResponse = await getContacts();
			if (contactResponse.data.status) {
				let tempList: IContact[] = contactResponse.data.contacts;
				tempList.sort((a, b) => strcmp(a.displayName, b.displayName));
				setContactList(tempList)
			}
		}
		setInterval(() => getContactsCaller(), 2000);
	}, []);

	function clearFields() {
		setTaskName("");
		setExtraDetails("");
		setLocation("");
		setPriority("");
    let today = new Date()
	  let tomorrow = new Date(today)
	  tomorrow.setDate(tomorrow.getDate() + 1)
		setDate(tomorrow);
		setReceiverUid("");
		setPriorityButton("Set Priority");
		setReceiveMessage("Nudge a friend!")
		setErrorMessage("");
		setSearchString("");
	}

	async function handleSubmit() {
		const user = firebase.auth().currentUser;

		if (taskName === "") {
			setErrorMessage("Please add a task name!");
		} else if (receiverUid === "") {
			setErrorMessage("Please select a contact to send this task to!")
		} else if (priority === "") {
			setErrorMessage("Please add a priority!");
		} else if (date.getTime() <= new Date().getTime()) {

			setErrorMessage("Please select a later date!");
		} else {
			if (user) {
				const toSend = {
					taskName: taskName,
					due: date.getTime(),
					location: location,
					priority: priority,
					receiverUid: receiverUid,
					extraDetails: extraDetails
				}
				addTask(toSend)
					.then((res) => {
						clearFields();
					})
					.catch(console.log);
			} else {
				alert('Not logged in, please login again.');
			}
		}
	}

	const handleSelectContact = (uid: string, name: string) => {
		setReceiveMessage('Send to: ' + name);
		setReceiverUid(uid);
		// console.log(receiverUid);
	}

	const handleSearch = () => {
		if (searchString === '') {
			return contactList;
		} else {
			let searched: IContact[] = [];
			for (let i = 0; i < contactList.length; i++) {
				if (contactList[i].displayName.toLowerCase().includes(searchString.toLowerCase())) {
					searched.push(contactList[i]);
				}
			}
			return searched;
		}
	}

	function getFirstName (name: string) {
		return name.substr(0, name.indexOf(' '));
	}

	function getLastName (name: string) {
		return name.substr(name.indexOf(' ') + 1);
	}

	const contactListElement = handleSearch().map((contact: IContact) =>
		<TouchableOpacity onPress={() => { handleSelectContact(contact.uid, contact.displayName) }} key={contact.uid} style={styles.contactDiv}>
			{/* {console.log(receiverUid)} */}
			{console.log(contact.uid)}
			<View style={contact.uid === receiverUid ? styles.highlightedImgDiv : styles.imgDiv}>
				<Image
					style={styles.profileImage}
					source={{ uri: contact.avatar ? contact.avatar : 'https://i.pinimg.com/originals/5d/70/18/5d70184dfe1869354afe7bf762416603.jpg' }}
				/>

			</View>
			<Text style={styles.firstName}>{getFirstName(contact.displayName)}</Text>
			<Text style={styles.lastName}>{getLastName(contact.displayName)}</Text>
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
					setPriority('medium');
					setPriorityButton('Set Priority');
				} else if (buttonIndex === 1) {
					setPriority('low');
					setPriorityButton('Low');
				} else if (buttonIndex === 2) {
					setPriority('medium');
					setPriorityButton('Medium');
				} else {
					setPriority('high');
					setPriorityButton('High');
				}
			}
		);

	return (
		<SafeAreaView style={styles.mainContainer}>
			<KeyboardAwareScrollView>
			<View style={styles.nameDiv}>
				<FeatherIcon name="edit" color="#2cb9b0" />
				<TextInput
					style={styles.taskName}
					onChangeText={setTaskName}
					placeholder="Add title"
					placeholderTextColor="#2cb9b0"
					value={taskName}
				/>
			</View>
				<Text style={styles.nudge}>{receiveMessage}</Text>
				<TouchableOpacity activeOpacity={1} style={styles.searchDiv}
					onPress={() => Keyboard.dismiss()}>
					<FeatherIcon name="search" color="#2cb9b0" />
					<TextInput
						style={styles.search}
						onChangeText={setSearchString}
						placeholder="Search by name"
						placeholderTextColor="#a9a9a9"
						value={searchString}
					/>
				</TouchableOpacity>
				<ScrollView horizontal={true}
					showsHorizontalScrollIndicator={false}
				>
					<View style={styles.contactList}>
						{contactListElement}
					</View>
				</ScrollView>

				<TouchableOpacity activeOpacity={1} style={styles.detailsDiv}
					onPress={() => Keyboard.dismiss()}>
					<FeatherIcon name="align-left" color="#2cb9b0" />
					<TextInput
						style={styles.details}
						onChangeText={setExtraDetails}
						placeholder="Add detail"
						placeholderTextColor="#a9a9a9"
						value={extraDetails}
						multiline={true}
					/>
				</TouchableOpacity>
				<View style={styles.locationDiv}>
					<FeatherIcon name="map-pin" color="#2cb9b0" />
					<TextInput
						style={styles.box}
						onChangeText={setLocation}
						placeholder="Add location"
						placeholderTextColor="#a9a9a9"
						value={location}
					/>
				</View>
				<TouchableOpacity onPress={onPress} style={{ display: 'flex', alignItems: 'center' }}>
					<View style={styles.buttonDiv}>
						<FeatherIconAlt name="bell" color='white' />
						<Text style={styles.text}>{priorityButton}</Text>
					</View>
				</TouchableOpacity>
				<View>
					<Text style={styles.nudge}>When is this due?</Text>
					<DateTimePicker
						style={styles.date}
						testID="dateTimePicker"
						value={date}
						mode={'datetime'}
						display="default"
						onChange={onChange}
					/>
				</View>
				<Text style={styles.error}> {errorMessage} </Text>
				<TouchableOpacity onPress={() => { handleSubmit() }} style={{ display: 'flex', alignItems: 'center' }} >
					<View style={styles.sendDiv}>
						<FeatherIconAlt name="send" color='white' />
						<Text style={styles.text}>Send</Text>
					</View>
				</TouchableOpacity>
			</KeyboardAwareScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	mainContainer: {
		display: 'flex',
		flex: 1,
		width: '100%',
		justifyContent: 'flex-start',
		backgroundColor: 'white'
	},
	highlightedImgDiv: {
		borderRadius: 90,
		padding: 2,
		backgroundColor: 'white',
		borderWidth: 2,
		borderColor: '#2cb9b0'
	},
	imgDiv: {
		borderRadius: 90,
		padding: 2,
		backgroundColor: 'white',
	},
	buttonDiv: {
		width: '55%',
		backgroundColor: '#2cb9b0',
		minHeight: 40,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		borderRadius: 10,
		marginBottom: 12,
		paddingRight: 10,
		marginTop: 20
	},
	sendDiv: {
		width: '90%',
		backgroundColor: '#2cb9b0',
		minHeight: 40,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		borderRadius: 10,
		marginBottom: 12,
		paddingRight: 10,
		marginTop: 10
	},
	text: {
		marginLeft: 3,
		color: 'white',
		fontSize: 18,
		fontWeight: '700'
	},
	taskName: {
		height: 40,
		width: '90%',
		fontSize: 28,
		color: 'black',
		fontWeight: '700',
	},
	nudge: {
		marginLeft: 20,
		fontSize: 20,
		marginTop: 13,
		fontWeight: '600'
	},
	detailsDiv: {
		display: 'flex',
		flexDirection: 'row',
		marginLeft: 20,
		marginTop: 25
	},
	searchDiv: {
		display: 'flex',
		flexDirection: 'row',
		marginLeft: 20,
		marginTop: 10
	},
	locationDiv: {
		display: 'flex',
		flexDirection: 'row',
		marginLeft: 20,
		marginTop: 10
	},
	nameDiv: {
		display: 'flex',
		flexDirection: 'row',
		marginLeft: 20,
		marginTop: 20
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
	box: {
		height: 40,
		width: '85%',
		fontSize: 18,
		fontWeight: '600',
		padding: 10,
		backgroundColor: '#ededed',
		borderRadius: 10,
		marginRight: 20
	},
	search: {
		height: 40,
		width: '85%',
		fontSize: 18,
		fontWeight: '600',
		padding: 10,
		backgroundColor: '#ededed',
		borderRadius: 10,
		marginRight: 20
	},
	input: {
		height: 40,
		width: '90%',
		margin: 12,
		borderWidth: 1,
		borderColor: 'blue',
	},
	contactDiv: {
		marginLeft: 20,
		marginTop: 10,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	profileImage: {
		width: 50,
		height: 50,
		borderRadius: 90
	},
	firstName: {
		paddingTop: 8,
		fontSize: 14,
		fontWeight: '500'
	},
	lastName: {
		fontSize: 14,
		fontWeight: '500'
	},
	contactList: {
		display: 'flex',
		flexDirection: 'row',
		marginTop: 5
	},
	date: {
		marginLeft: 20,
		marginTop: 10,
		fontWeight: '600'
	},
	error: {
		fontSize: 15,
		paddingTop: 10,
		color: '#e93342',
		fontWeight: '500',
		paddingLeft: 17
	}
});
