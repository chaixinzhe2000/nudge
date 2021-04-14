import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import * as firebase from 'firebase'
import 'firebase/firestore';
import "firebase/functions";
import { Feather } from '@expo/vector-icons';
import { user } from "firebase-functions/lib/providers/auth";

function FeatherIcon(props: { name: React.ComponentProps<typeof Feather>['name']; color: string }) {
	return <Feather size={22} style={{ marginTop: -1 }} {...props} />;
}

interface IChangeNameModalProps {
  changeNameModalOpen: boolean,
  setChangeNameModalOpen: any,
}

export default function ChangeNameModal(props: IChangeNameModalProps) {
  const user = firebase.auth().currentUser;

  const [newName, setNewName] = useState(user ? user.displayName : "");

  var changeName = firebase.functions().httpsCallable('changeName');

  async function handleSubmit() {
    const user = firebase.auth().currentUser;

    if (user) {

      const toSend = {
        newName: newName,
      }
      changeName(toSend)
        .then((result) => {
          console.log(result);
          if (result.data.status === false) {
            setNewName(user ? user.displayName : "");
            alert('Failed to change name. Please try again.');
            return;
          } else {
            setNewName('');
            props.setChangeNameModalOpen(false);
          }
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
    <Modal visible={props.changeNameModalOpen} animationType='slide'>
      <View style={styles.modalContent}>
	  	<TouchableOpacity onPress={() => props.setChangeNameModalOpen(false)} >
          <View style={styles.closeButton}>
		  	<FeatherIcon name="x" color='#2cb9b0' />
            <Text style={styles.close}>CLOSE</Text>
          </View>
    	</TouchableOpacity>
		<View style={styles.inputDiv}>
			<Text style={styles.title}>Change your name!</Text>
        	<TextInput
				placeholder='Blueno Bear'
				placeholderTextColor='#f9f7f7' textAlign='left'
          		style={styles.input}
          		onChangeText={setNewName}
          		value={newName || ""}
        	/>
			<Text style={styles.subtitle}>NEW NAME</Text>
		</View>
        <TouchableOpacity onPress={() => handleSubmit()} >
          <View style={styles.buttonDiv}>
            <Text style={styles.text}>COMMIT CHANGES</Text>
			<FeatherIcon name="chevron-right" color="white" />
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
	fontSize: 18,
    fontWeight: '700'
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
	backgroundColor: '#c4c4c4',
	borderRadius: 10,
	minHeight: 50,
	fontSize: 18,
	paddingLeft: 20,
	fontWeight: '600',
	color: 'white'
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
  buttonDiv: {
	  width: '100%',
	  minWidth: 345,
	backgroundColor: '#2cb9b0',
		minHeight: 50,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		borderRadius: 10,
		marginBottom: 12,
		marginLeft: 25,
		paddingLeft: 20
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700'
  },
})

