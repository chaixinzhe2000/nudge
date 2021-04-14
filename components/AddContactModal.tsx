import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import * as firebase from 'firebase'
import 'firebase/firestore';
import "firebase/functions";

interface IAddContactModalProps {
  addContactModalOpen: boolean,
  setAddContactModalOpen: any,
}

export default function AddContactModal(props: IAddContactModalProps) {

  const [newContactEmail, setNewContactEmail] = useState('');


  var addContact = firebase.functions().httpsCallable('addContact');


  async function handleSubmit() {
    const user = firebase.auth().currentUser;

    if (user) {

      if (user.email === newContactEmail) {
        setNewContactEmail('');
        alert('You cannot add yourself as a contact. Please try again.');
        return;
      }
      
      const toSend = {
        targetEmail: newContactEmail,
        // email: user.email,
        // uid: user.uid
      }
      addContact(toSend)
      .then((result) => {
        console.log(result);
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

  return (
    <Modal visible={props.addContactModalOpen} animationType='slide'>
      <View style={styles.modalContent}>
        <MaterialIcons
          name='close'
          size={24}
          onPress={() => props.setAddContactModalOpen(false)}
          style={styles.closeButton}
        />
        <TextInput
          style={styles.input}
          onChangeText={setNewContactEmail}
          value={newContactEmail}
          placeholder={'enter email to find contact'}
        />
        <TouchableOpacity onPress={() => handleSubmit()} >
          <View style={styles.buttonDiv}>
            <Text style={styles.text}>Add Contact</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  closeButton: {
    marginTop: 30
  },
  input: {
    height: 40,
    borderWidth: 1,
    width: '95%'
  },
  buttonDiv: {
    backgroundColor: 'white',
    minHeight: 50,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    marginBottom: 12,
    paddingRight: 10
  },
  text: {
    marginLeft: 15,
    color: '#2cb9b0',
    fontSize: 18,
    fontWeight: '700'
  }
})

