import React, { useEffect } from "react";
import { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import * as firebase from 'firebase';

function LoginScreen() {

	const [email, setEmail]: [string, any] = useState('');
	const [password, setPassword]: [string, any] = useState('');



	
	const handleLogin = () => {
		firebase.auth().signInWithEmailAndPassword(email, password)
			.then((res) => {
				console.log('succesfully loged in')
			})
			.catch((err) => {
				console.log(err)
			})
	}


	return (

		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<TextInput
				placeholder="Email" onChangeText={(text) => setEmail(text)} />
			<TextInput
				placeholder="Password" secureTextEntry={true} onChangeText={(text) => setPassword(text)} />
			<Button onPress={() => {handleLogin()}} title="Login" />
		</View>
	);
}

export default LoginScreen;