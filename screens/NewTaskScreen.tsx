import * as React from 'react';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView, StyleSheet, TextInput } from 'react-native';
import { useState } from 'react';
import * as firebase from 'firebase'
import 'firebase/firestore';


export default function NewTaskScreen() {

  const [taskName, setTaskName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const dbh = firebase.firestore();

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

  var getContacts = firebase.functions().httpsCallable('getContacts');

  async function handleSubmit() {
    const user = firebase.auth().currentUser;

    if (user) {
      const toSend = {
      }
      getContacts(toSend)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        // Getting the Error details.
        console.log(error.code)
        console.log(error.message)
        console.log(error.details)
      });
    } else {
      alert('Not logged in, please login again.');
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
  }
});
