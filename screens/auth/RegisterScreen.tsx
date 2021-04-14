import React from "react";
import { useState } from "react";
import { View, Text, TextInput, Button, Platform, StyleSheet, TouchableOpacity } from "react-native";
import * as firebase from 'firebase/app';
// import firebase from "firebase/app";
// import "firebase/messaging";
import { Permissions  } from 'expo';
import Constants from "expo-constants";
import * as Notifications from 'expo-notifications';
import { Feather } from '@expo/vector-icons';

function FeatherIcon(props: { name: React.ComponentProps<typeof Feather>['name']; color: string }) {
	return <Feather size={24} style={{ marginBottom: -3 }} {...props} />;
}

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
		<View style={styles.container}>
			<TextInput
				placeholder="Your Name" placeholderTextColor='white' textAlign='center'
				onChangeText={(text) => setName(text)} style={styles.input}/>
			<TextInput
				placeholder="Your Email" placeholderTextColor='white' textAlign='center'
				onChangeText={(text) => setEmail(text)} style={styles.input}/>
			<TextInput
				placeholder="Password" placeholderTextColor='white' textAlign='center'
				secureTextEntry={true} onChangeText={(text) => setPassword(text)} style={styles.input}/>
			<TouchableOpacity onPress={() => {handleSignUp()}} >
				<View style={styles.buttonDiv}>
					<Text style={styles.text}>START NUDGING</Text>
					<FeatherIcon name="arrow-right" color='#2cb9b0' />
				</View>
          	</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#2cb9b0',
		paddingTop: 90,
		paddingLeft: 30,
		paddingRight: 30
	},
	welcome: {
		fontSize: 40,
		fontWeight: '500',
		color: 'white'
	},
	nudge: {
		fontSize: 40,
		fontWeight: '700',
		color: 'white',
		marginBottom: 45
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
		paddingRight: 10,
		marginTop: 20
	},
	text: {
		marginLeft: 15,
		color: '#2cb9b0',
		fontSize: 18,
		fontWeight: '700'
	},
	input: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		color: 'white',
		fontSize: 20,
		borderRadius: 10,
		backgroundColor: '#4bc4bc',
		minHeight: 55,
		marginBottom: 10,
		fontWeight: '500'
	}
});

export default Register;