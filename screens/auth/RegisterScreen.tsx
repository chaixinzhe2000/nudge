import React from "react";
import { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import * as firebase from 'firebase';
// import firebase from "firebase/app";
// import "firebase/messaging";


function Register() {
  // Firebase create user collection and add user
  // TODO: test this
  const dbh = firebase.firestore();

  async function handleAddUser() {
    const user = firebase.auth().currentUser;
    const messaging = firebase.messaging();

    
    if (user !== null) {
      let userFCMToken;
      userFCMToken = Notification.requestPermission()
      .then(() => {
        console.log('Have permission')
        return messaging.getToken();
      })
      .then((token) => {
        console.log(token);
        return token;
      })
      .catch((error) => {
        console.log(error)
      })
      dbh.collection("User").add({
        name: name,
        email: email,
        uid: user.uid,
        messageToken: userFCMToken,
      })
      return true;
    }
    return false;
  }

  //----------------------------------------------------------------
	const [name, setName]: [string, any] = useState('');

	const [email, setEmail]: [string, any] = useState('');
	const [password, setPassword]: [string, any] = useState('');

	const handleSignUp = () => {
		console.log(email)
		firebase.auth().createUserWithEmailAndPassword(email, password)
			.then((res) => {
				console.log(res);
        handleAddUser();
			})
			.catch((err) => {
				console.log(err)
			})
	}
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<TextInput
				placeholder="Name" onChangeText={(text) => setName(text)} />
			<TextInput
				placeholder="Email" onChangeText={(text) => setEmail(text)} />
			<TextInput
				placeholder="Password" secureTextEntry={true} onChangeText={(text) => setPassword(text)} />
			<Button onPress={() => {handleSignUp()}} title="Register" />
		</View>
	);
}

export default Register;