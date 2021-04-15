import React from "react";
import { useState } from "react";
import { View, Text, TextInput, Button, Platform, StyleSheet, TouchableOpacity, Image } from "react-native";
import * as firebase from 'firebase/app';
// import firebase from "firebase/app";
// import "firebase/messaging";
import { Permissions } from 'expo';
import Constants from "expo-constants";
import * as Notifications from 'expo-notifications';
import { Feather } from '@expo/vector-icons';
import getCameraPermissions from '../../util/UserPermission';
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'



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
		let remoteUri: string = '';

		if (user !== null) {
      
			const userFCMToken = await registerForPushNotificationsAsync();
			dbh.collection("User").doc(user.uid).set({
				displayName: name,
				email: email,
				uid: user.uid,
				messageToken: userFCMToken,
				contacts: [],
				avatar: null,
        favorites: []
			})
			if (imageUri !== '') {
				remoteUri = await uploadPhotoAsync(imageUri, `avatars/${user.uid}`)
				dbh.collection("User").doc(user.uid).set(
					{ avatar: remoteUri }, { merge: true }
				)
			}
      await user.updateProfile({displayName: name, photoURL: remoteUri})
        .catch(err =>(console.log(err)));
			return true;
		}
		return false;
	}

	const handlePickAvatar = async () => {
		getCameraPermissions();
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3]
		})

		if (!result.cancelled) {
			setImageUri(result.uri)
		}
	}

	const uploadPhotoAsync = async (uri, filename): Promise<string> => {
		return new Promise(async (res, rej) => {
			const response = await fetch(uri, filename);
			const file = await response.blob();

			let upload = firebase.storage().ref(filename).put(file);
			upload.on(
				"state_changed",
				snapshot => { },
				err => {
					rej(err);
				},
				async () => {
					const url = await upload.snapshot.ref.getDownloadURL()
					res(url);
				}
			)
		})
	}

	//----------------------------------------------------------------
	const [name, setName]: [string, any] = useState('');
	const [imageUri, setImageUri]: [string, any] = useState('')
	const [email, setEmail]: [string, any] = useState('');
	const [password, setPassword]: [string, any] = useState('');

	const handleSignUp = () => {
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
    <KeyboardAwareScrollView>
		<View style={styles.container}>
			<View style={{display: 'flex', alignItems: 'center'}}>
				<Text style={styles.welcome}>Let's get you</Text>
				<Text style={styles.nudge}>setup.</Text>
			</View>
			<TouchableOpacity onPress={handlePickAvatar} style={styles.profileDiv}>
				<Image
					style={styles.profileImage}
					source={{ uri: imageUri ? imageUri : 'https://i.pinimg.com/originals/5d/70/18/5d70184dfe1869354afe7bf762416603.jpg' }}
				/>
				<Text style={styles.subtitle}>CHOOSE PROFILE</Text>
			</TouchableOpacity>
			<TextInput
				placeholder="Your Name" placeholderTextColor='white' textAlign='center'
				onChangeText={(text) => setName(text)} style={styles.input} />
			<TextInput
				placeholder="Your Email" placeholderTextColor='white' textAlign='center'
				onChangeText={(text) => setEmail(text)} style={styles.input} />
			<TextInput
				placeholder="Password" placeholderTextColor='white' textAlign='center'
				secureTextEntry={true} onChangeText={(text) => setPassword(text)} style={styles.input} />
			<TouchableOpacity onPress={() => { handleSignUp() }} >
				<View style={styles.buttonDiv}>
					<Text style={styles.text}>START NUDGING</Text>
					<FeatherIcon name="arrow-right" color='#2cb9b0' />
				</View>
			</TouchableOpacity>
		</View>
    </KeyboardAwareScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#2cb9b0',
		paddingTop: 30,
		paddingLeft: 30,
		paddingRight: 30
	},
	welcome: {
		fontSize: 40,
		fontWeight: '500',
		color: 'white'
	},
	nudge: {
		fontSize: 39,
		fontWeight: '700',
		color: 'white',
		marginBottom: 45
	},
	profileDiv: {
		display: 'flex',
		alignItems: 'center',
		marginBottom: 35
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
	},
	profileImage: {
		width: 80,
		height: 80,
		marginRight: 10,
		borderRadius: 90,
		marginBottom: 10
	},
	subtitle: {
		color: 'white',
		fontWeight: '700',
		fontSize: 15
	}
});

export default Register;