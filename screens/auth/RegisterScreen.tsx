import React from "react";
import { useState } from "react";
import { View, Text, TextInput, Button, Platform } from "react-native";
import * as firebase from 'firebase/app';
// import firebase from "firebase/app";
// import "firebase/messaging";
import { Permissions  } from 'expo';
import Constants from "expo-constants";
import * as Notifications from 'expo-notifications'

function Register() {
  // Firebase create user collection and add user
  // TODO: test this
  const dbh = firebase.firestore();

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }


  async function handleAddUser() {
    const user = firebase.auth().currentUser;
    
    console.log("WE RAN TYHIS")
    
    if (user !== null) {
      const userFCMToken = await registerForPushNotificationsAsync();
      dbh.collection("User").add({
        displayName: name,
        email: email,
        uid: user.uid,
        messageToken: userFCMToken,
        friends: []
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