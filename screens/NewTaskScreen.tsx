import * as React from 'react';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Platform, SafeAreaView, StyleSheet, TextInput, View, Text, TouchableOpacity, Image, ActionSheetIOS, Keyboard } from 'react-native';
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
	const [contactList, setContactList]: [IContact[], any] = useState([])
  const [errorMessage, setErrorMessage]: [string, any] = useState("");
	// data stuff
	const [date, setDate]: [Date, any] = useState(new Date());
	const [show, setShow] = useState(true);

	const onChange = (event, selectedDate) => {
		const currentDate = selectedDate;
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

  function clearFields() {
    setTaskName("");
    setExtraDetails("");
    setLocation("");
    setPriority("");
    setDate(new Date());
    setReceiverUid("");
    setPriorityButton("Set Priority");
    setReceiveMessage("Nudge a friend!")
    setErrorMessage("");
  }

	async function handleSubmit() {
		const user = firebase.auth().currentUser;

    console.log(taskName);
    console.log(receiverUid);
    console.log(priority);
    console.log(date);
    console.log(date.getSeconds());

    if (taskName === "") {
      setErrorMessage("Please add a task name!");
    } else if (receiverUid === "") {
      setErrorMessage("Please select a contact to send this task to!")
    } else if (priority === "") {
      setErrorMessage("Please add a priority!");
    } else if (date.getSeconds() <= (new Date).getSeconds()) {
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
            console.log(res)
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

	const contactListElement = contactList.map((contact: IContact) =>
		<TouchableOpacity onPress={() => { handleSelectContact(contact.uid, contact.displayName) }} key={contact.uid} style={styles.contactDiv}>
			{/* {console.log(receiverUid)} */}
			{console.log(contact.uid)}
			<View style={contact.uid === receiverUid ? styles.highlightedImgDiv : styles.imgDiv}>
				<Image
					style={styles.profileImage}
					source={{ uri: contact.avatar ? contact.avatar : 'https://i.pinimg.com/originals/5d/70/18/5d70184dfe1869354afe7bf762416603.jpg' }}
				/>

			</View>
			<Text style={styles.name}>{contact.displayName}</Text>
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
				<TextInput
					style={styles.taskName}
					onChangeText={setTaskName}
					placeholder="Add title"
					placeholderTextColor="#2cb9b0"
					value={taskName}
				/>
				<View>
					<Text style={styles.nudge}>{receiveMessage}</Text>
					<View style={styles.contactList}>
						{contactListElement}
					</View>
				</View>
				<TouchableOpacity activeOpacity={1} style={styles.detailsDiv}
					onPress={() => Keyboard.dismiss()}>
					<FeatherIcon name="align-left" color="#2cb9b0" />
					<TextInput
						style={styles.box}
						onChangeText={setExtraDetails}
						placeholder="Add Detail"
						placeholderTextColor="#a9a9a9"
						value={extraDetails}
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
        <Text> {errorMessage} </Text>
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
		marginTop: 38
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
		marginTop: 20,
		color: 'black',
		fontWeight: '700',
		marginLeft: 20
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
		width: 60,
		height: 60,
		borderRadius: 90
	},
	name: {
		paddingTop: 8,
		fontSize: 14,
		fontWeight: '500'
	},
	contactList: {
		display: 'flex',
		flexDirection: 'row'
	},
	date: {
		marginLeft: 20,
		marginTop: 10,
		fontWeight: '600'
	}
});
