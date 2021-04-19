import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Keyboard, SafeAreaView, ActionSheetIOS, Platform } from "react-native";
import * as firebase from 'firebase'
import 'firebase/firestore';
import "firebase/functions";
import { Feather } from '@expo/vector-icons';
import { user } from "firebase-functions/lib/providers/auth";
import moment from "moment";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePicker from '@react-native-community/datetimepicker';

function FeatherIcon(props: { name: React.ComponentProps<typeof Feather>['name']; color: string }) {
	return <Feather size={24} style={{ marginTop: 9, paddingRight: 10 }} {...props} />;
}

function FeatherIconAlt(props: { name: React.ComponentProps<typeof Feather>['name']; color: string }) {
	return <Feather size={22} style={{ marginTop: 3, paddingRight: 5 }} {...props} />;
}

function FeatherIconClose(props: { name: React.ComponentProps<typeof Feather>['name']; color: string }) {
	return <Feather size={22} style={{ marginTop: -2 }} {...props} />;
}


interface IContact {
	uid: string,
	displayName: string,
	email: string,
	avatar: string
}

interface IEditTaskModalProps {
  editTaskMode: boolean,
  setEditTaskMode: any,
  taskModalOpen: boolean,
  setTaskModalOpen: any,
  selectedTask: any,
  selectedUser: IContact
}

export default function EditTaskModal(props:IEditTaskModalProps) {
  const [taskName, setTaskName] = useState(props.selectedTask.taskName);
  const [receiveMessage, setReceiveMessage] = useState(props.selectedUser.displayName)
	const [extraDetails, setExtraDetails] = useState(props.selectedTask.extraDetails);
	const [location, setLocation] = useState(props.selectedTask.location);
	const [priority, setPriority] = useState(props.selectedTask.priority);
	const [priorityButton, setPriorityButton] = useState("Set Priority");
	const [date, setDate]: [Date, any] = useState(new firebase.firestore.Timestamp(props.selectedTask.due ? props.selectedTask.due._seconds : 0, props.selectedTask.due ? props.selectedTask.due._nanoseconds : 0).toDate());
	const [show, setShow] = useState(true);
  const [errorMessage, setErrorMessage]: [string, any] = useState("");
  function toggleEditMode() {
    props.setEditTaskMode(!props.editTaskMode);    
	}

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

	const onChange = (event, selectedDate) => {
		const currentDate = selectedDate;
		setShow(Platform.OS === 'ios');
		setDate(currentDate);
	};
  
  var editTask = firebase.functions().httpsCallable('editTask');

  async function handleSave() {
		const user = firebase.auth().currentUser;

		if (taskName === "") {
			setErrorMessage("Please add a task name!");
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
          receiverUid: props.selectedTask.receiverUid,
          senderUid: props.selectedTask.senderUid,
          extraDetails: extraDetails,
          oldTaskId: props.selectedTask.id
        }
				
				editTask(toSend)
					.then((res) => {
            props.setEditTaskMode(false);
            props.setTaskModalOpen(false);
					})
					.catch(console.log);
			} else {
				alert('Not logged in, please login again.');
			}
		}
	}

  function autoFillEditFields() {
    setTaskName(props.selectedTask.taskName);
    setReceiveMessage(props.selectedUser.displayName)
    setExtraDetails(props.selectedTask.extraDetails);
    setLocation(props.selectedTask.location);
    setPriority(props.selectedTask.priority);
    setPriorityButton("Set Priority");
    setDate(new firebase.firestore.Timestamp(props.selectedTask.due ? props.selectedTask.due._seconds : 0, props.selectedTask.due ? props.selectedTask.due._nanoseconds : 0).toDate());
    setShow(true);
    setErrorMessage("");
  }

  useEffect(() => { autoFillEditFields();}, [props.selectedTask])

	let bColor = props.selectedTask.priority === 'high' ? '#f58822' : '#2cb9b0';

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
		completeButtonWrapper: {
			display: 'flex',
			alignItems: 'center',
			width: '100%',
			height: 50,
			marginTop: 25,
			flexDirection: 'row',
			justifyContent: 'center'
		},
		deleteButtonWrapper: {
			display: 'flex',
			alignItems: 'center',
			width: '100%',
			height: 50,
			marginTop: 10
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
		markCompletedButton: {
			backgroundColor: '#2cb9b0',
			minHeight: 40,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			flexDirection: 'row',
			borderRadius: 10,
			padding: 10,
			width: 115
		},
		editButton: {
			backgroundColor: '#2cb9b0',
			minHeight: 40,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			flexDirection: 'row',
			borderRadius: 10,
			padding: 10,
			marginLeft: 15,
			width: 115
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
			width: 120
		},
		text: {
			color: 'white',
			fontSize: 18,
			fontWeight: '700'
		},
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
	imgDiv2: {
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
	text2: {
		marginLeft: 3,
		color: 'white',
		fontSize: 18,
		fontWeight: '700'
	},
	taskName2: {
		height: 40,
		width: '90%',
		fontSize: 28,
		color: 'black',
		fontWeight: '700',
	},
	nudge2: {
		marginLeft: 20,
		fontSize: 20,
		marginTop: 13,
		fontWeight: '600'
	},
	detailsDiv2: {
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
	locationDiv2: {
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
	details2: {
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
	box2: {
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
	input2: {
		height: 40,
		width: '90%',
		margin: 12,
		borderWidth: 1,
		borderColor: 'blue',
	},
	contactDiv2: {
		marginLeft: 20,
		marginTop: 10,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	profileImage2: {
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
	contactList2: {
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
	})

  return (
    <Modal visible={props.taskModalOpen} animationType='slide'>
      <SafeAreaView style={styles.mainContainer}>
    <KeyboardAwareScrollView>
    <View style={styles.nameDiv}>
      <FeatherIcon name="edit" color="#2cb9b0" />
      <TextInput
        style={styles.taskName2}
        onChangeText={setTaskName}
        placeholder="Add title"
        placeholderTextColor="#2cb9b0"
        value={taskName}
      />
    </View>
      <Text style={styles.nudge2}>{receiveMessage}</Text>
      <TouchableOpacity onPress={onPress} style={{ display: 'flex', alignItems: 'center' }}>
        <View style={styles.buttonDiv}>
          <FeatherIconAlt name="bell" color='white' />
          <Text style={styles.text2}>{priorityButton}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={1} style={styles.detailsDiv2}
        onPress={() => Keyboard.dismiss()}>
        <FeatherIcon name="align-left" color="#2cb9b0" />
        <TextInput
          style={styles.details2}
          onChangeText={setExtraDetails}
          placeholder="Add detail"
          placeholderTextColor="#a9a9a9"
          value={extraDetails}
          multiline={true}
        />
      </TouchableOpacity>
      <View style={styles.locationDiv2}>
        <FeatherIcon name="map-pin" color="#2cb9b0" />
        <TextInput
          style={styles.box2}
          onChangeText={setLocation}
          placeholder="Add location"
          placeholderTextColor="#a9a9a9"
          value={location}
        />
      </View>
      
      <View>
        <Text style={styles.nudge2}>When is this due?</Text>
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
      <TouchableOpacity onPress={() => { handleSave() }} style={{ display: 'flex', alignItems: 'center' }} >
        <View style={styles.sendDiv}>
          <FeatherIconAlt name="edit-3" color='white' />
          <Text style={styles.text2}>Edit</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => toggleEditMode()} style={styles.editButton}>
          <Text style={styles.text}>Cancel</Text>
        </TouchableOpacity>
    </KeyboardAwareScrollView>
    </SafeAreaView>
  </Modal>
);
}
