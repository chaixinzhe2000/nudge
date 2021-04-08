import * as React from 'react';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView, StyleSheet, TextInput } from 'react-native';
import { useState } from 'react';
import * as firebase from 'firebase'
import 'firebase/firestore';


export default function NewTaskScreen() {

  const [taskName, setTaskName] = useState("");
  const dbh = firebase.firestore();

  function handleSubmit() {
    dbh.collection("Task").add({
      taskName: taskName
    })
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <TextInput
        style={styles.input}
        onChangeText={setTaskName}
        placeholder="Task Name"
        value={taskName}
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
