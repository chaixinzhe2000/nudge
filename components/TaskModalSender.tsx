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
import EditTaskModal from './EditTaskModal'

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

export default function TaskModalSender(props: ITaskModalProps) {
  const user = firebase.auth().currentUser;

  const [newName, setNewName] = useState(user !== null ? user.displayName : "");
  const [contactList, setContactList]: [IContact[], any] = useState([]);

  // for edit task
  const [editTaskMode, setEditTaskMode]: [boolean, any] = useState(false);

  useEffect(() => {
    if (user) {
      setNewName(user.displayName);
      console.log(user.displayName);
    }
  }, [props.taskModalOpen])

  var task = firebase.functions().httpsCallable('task');
  var markTaskAsCompleted = firebase.functions().httpsCallable('markTaskAsCompleted');
  var deleteTask = firebase.functions().httpsCallable('deleteTask');

  async function handleMarkAsCompleted() {
    const user = firebase.auth().currentUser;
    if (user) {
      const toSend = {
        taskId: props.selectedTask.id
      }
      markTaskAsCompleted(toSend)
        .then((result) => {
          console.log(result);
          props.setTaskModalOpen(false);
        })
        .catch((error) => {
          // Getting the Error details.
          var code = error.code;
          var message = error.message;
          var details = error.details;
          console.log(code)
          console.log(message)
          console.log(details)
        })
    }
  }

  async function handleDeleteTask() {
    const user = firebase.auth().currentUser;
    if (user) {
      const toSend = {
        taskId: props.selectedTask.id
      }
      deleteTask(toSend)
        .then((result) => {
          console.log(result.data);
          props.setTaskModalOpen(false);
        })
        .catch((error) => {
          // Getting the Error details.
          var code = error.code;
          var message = error.message;
          var details = error.details;
          console.log(code)
          console.log(message)
          console.log(details)
        })
    }
  }

  function toggleEditMode() {
    setEditTaskMode(!editTaskMode);
    console.log(editTaskMode)
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

  const bColorGetter = () => {
	if (props.selectedTask.priority === 'high') {
		return '#f58822'
	} else if (props.selectedTask.priority === 'low') {
		return '#498bef'
	}
	return '#2cb9b0'
}
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
      width: '90%',
      fontSize: 28,
      marginTop: 20,
      color: 'black',
      fontWeight: '700',
      marginLeft: 25,
	  flexWrap: 'wrap'
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
      backgroundColor: bColorGetter(),
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

  if (editTaskMode === false) {
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
          <View style={styles.completeButtonWrapper}>
            <TouchableOpacity onPress={() => handleMarkAsCompleted()} style={styles.markCompletedButton}>
              <Text style={styles.text}>Completed</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { toggleEditMode(); }} style={styles.editButton}>
              <Text style={styles.text}>Edit Task</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.deleteButtonWrapper}>
            <TouchableOpacity onPress={() => handleDeleteTask()} style={styles.deleteButton}>
              <Text style={styles.text}>Delete Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  } else {
    return (
      <EditTaskModal editTaskMode={editTaskMode} setEditTaskMode={setEditTaskMode} taskModalOpen={props.taskModalOpen}
        setTaskModalOpen={props.setTaskModalOpen} selectedTask={props.selectedTask} selectedUser={props.selectedUser} />
    );
  }
}


