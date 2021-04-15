import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import * as firebase from 'firebase'
import 'firebase/firestore';
import "firebase/functions";
import { Feather } from '@expo/vector-icons';
import { user } from "firebase-functions/lib/providers/auth";

function FeatherIcon(props: { name: React.ComponentProps<typeof Feather>['name']; color: string }) {
	return <Feather size={22} style={{ marginTop: -2 }} {...props} />;
}

interface IChangePasswordModalProps {
  changePasswordModalOpen: boolean,
  setChangePasswordModalOpen: any,
}

export default function ChangePasswordModal(props: IChangePasswordModalProps) {
  const user = firebase.auth().currentUser;

  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit() {
    const user = firebase.auth().currentUser;
    if (user) {
      user.updatePassword(newPassword)
        .then(() => {
          setNewPassword('');
          setErrorMessage('');
          props.setChangePasswordModalOpen(false);
        })
        .catch((error) => {
          setNewPassword('');
          setErrorMessage('Oh no! Failed to update password!');
          console.log(error.code)
          console.log(error.message)
          console.log(error.details)
        });
    } else {
      alert('Not logged in, please login again.');
    }
  }

  return (
    <Modal visible={props.changePasswordModalOpen} animationType='slide'>
      <View style={styles.modalContent}>
	  	<TouchableOpacity onPress={() => props.setChangePasswordModalOpen(false)} >
          <View style={styles.closeButton}>
		  	<FeatherIcon name="x" color='#2cb9b0' />
            <Text style={styles.close}>CLOSE</Text>
          </View>
    	</TouchableOpacity>
		<View style={styles.inputDiv}>
			<Text style={styles.title}>Change your password!</Text>
        	<TextInput
				placeholder='super-secret-password'
				placeholderTextColor='#a9a9a9' textAlign='left'
          		style={styles.input}
          		onChangeText={setNewPassword}
          		value={newPassword}
				secureTextEntry={true}
        	/>
			<Text style={styles.subtitle}>NEW PASSWORD</Text>
      <Text style={styles.subtitle}>{errorMessage}</Text>
		</View>
		<View style={styles.buttonWrapper}>
			<TouchableOpacity onPress={() => handleSubmit()} style={styles.buttonDiv}>
				<Text style={styles.text}>Change Password</Text>
			</TouchableOpacity>
		</View>
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
	fontSize: 16,
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
  buttonWrapper: {
	display: 'flex',
	alignItems: 'center',
	width: '100%',
	height: 50
  },
  buttonDiv: {
	backgroundColor: '#2cb9b0',
	display: 'flex',
	flex: 1,
	width: '88%',
	borderRadius: 10,
	justifyContent: 'center',
	alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700'
  },
})

