import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import * as firebase from 'firebase'
import 'firebase/firestore';
import "firebase/functions";
import { Feather } from '@expo/vector-icons';
import { user } from "firebase-functions/lib/providers/auth";

function FeatherIcon(props: { name: React.ComponentProps<typeof Feather>['name']; color: string }) {
	return <Feather size={22} style={{ marginTop: -2 }} {...props} />;
}

interface IChangeNameModalProps {
  changeNameModalOpen: boolean,
  setChangeNameModalOpen: any,
}

export default function ChangeNameModal(props: IChangeNameModalProps) {
  const user = firebase.auth().currentUser;

  const [newName, setNewName] = useState(user !==null ? user.displayName : "");

  useEffect(() => {
    if (user) {
      setNewName(user.displayName);
    }
  }, [props.changeNameModalOpen])

  var changeName = firebase.functions().httpsCallable('changeName');

  async function handleSubmit() {
    const user = firebase.auth().currentUser;

    if (user) {
      await user.updateProfile({displayName: newName})
        .catch(err =>(console.log(err)));
      const toSend = {
        newName: newName,
      }
      changeName(toSend)
        .then((result) => {
          if (result.data.status === false) {
            if (user) {
              setNewName(user.displayName);
            }
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
        	<TextInput textAlign='left' placeholder={user!==null ? user.displayName || "" : ""}
          		style={styles.input}
          		onChangeText={setNewName}
          		value={newName || ""}
        	/>
			<Text style={styles.subtitle}>NEW NAME</Text>
		</View>
		<View style={styles.buttonWrapper}>
			<TouchableOpacity onPress={() => handleSubmit()} style={styles.buttonDiv}>
				<Text style={styles.text}>Change Name</Text>
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

