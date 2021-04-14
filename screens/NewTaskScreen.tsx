import * as React from 'react';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Platform, SafeAreaView, StyleSheet, TextInput, View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import * as firebase from 'firebase'
import 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';


export default function NewTaskScreen() {

  const [taskName, setTaskName] = useState("");
  const [extraDetails, setExtraDetails] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState("");
  const [receiverUid, setReceiverUid] = useState("");
  const [contactsList, setContactsList] = useState([]);

  // data stuff
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(true);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  var getContacts = firebase.functions().httpsCallable('getContacts');


  useEffect(() => {
    async function getContactsCaller() {
      await getContacts();
    }
    getContactsCaller();
    console.log("contactsList");
    console.log(contactsList);
  },[])


  const db = firebase.firestore();


  // async function handleSubmit() {
  //   const user = firebase.auth().currentUser;

  //   if (user) {
  //     // // get user from db
  //     // const userSearchQuery = dbh.collection('User').doc(user.uid);
  //     // const userDoc = await userSearchQuery.get();
  //     // if (!userDoc.exists) {
  //     //   console.log("userDoc does not exist");
  //     // } else {
  //     //   console.log(userDoc.data);
  //     // }

  //     // // find receiver


  //     const toSend = {
  //       taskName: taskName,
  //       timeStamp: Date.now(),
  //       creatorId: user.uid,
  //       creatorEmail: user.email,
  //     }
  //     dbh.collection("Task").add(toSend)
  //   } else {
  //     alert('Not logged in, please login again.');
  //   }

  // }


  async function handleGetContacts() {
    const user = firebase.auth().currentUser;
    if (user) {
      const toSend = {
      }
      getContacts(toSend)
      .then((result) => {
        console.log(result.data.contacts);
        setContactsList(result.data.contacts);
        return result.data.contacts;
      })
      .catch((error) => {
        // Getting the Error details.
        console.log(error.code)
        console.log(error.message)
        console.log(error.details)
        return [];
      });
    } else {
      alert('Not logged in, please login again.');
      return [];
    }
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <TextInput
        style={styles.input}
        onChangeText={setTaskName}
        placeholder="Task Name"
        value={taskName}
      />
      <TextInput
        style={styles.input}
        onChangeText={setReceiverName}
        placeholder="Receiver's Name"
        value={receiverName}
      />
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
        // onPress={() => handleSubmit()}

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
  }
});
