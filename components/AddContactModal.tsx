import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import * as firebase from 'firebase'
import 'firebase/firestore';
interface IAddContactModalProps {
  addContactModalOpen: boolean,
  setAddContactModalOpen: any,
}

export default function AddContactModal(props: IAddContactModalProps) {

const [newContactEmail, setNewContactEmail] = useState('');

  async function handleSubmit() {
    const user = firebase.auth().currentUser;

    if (user) {
      // // get user from db
      // const userSearchQuery = dbh.collection('User').doc(user.uid);
      // const userDoc = await userSearchQuery.get();
      // if (!userDoc.exists) {
      //   console.log("userDoc does not exist");
      // } else {
      //   console.log(userDoc.data);
      // }

      // // find receiver


      const toSend = {
        newContactEmail: newContactEmail,
        currentUserEmail: user.email
      }
      
      dbh.collection("Task").add(toSend)
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
          onPress={()=> props.setAddContactModalOpen(false)}
          style={styles.closeButton}
          />

        <Text> Hello from the modal :)</Text>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
  },
  closeButton: {
    marginTop: 599
  }
})

