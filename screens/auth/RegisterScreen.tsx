import React from "react";
import { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import * as firebase from 'firebase';

function Register() {
	const [name, setName]: [string, any] = useState('');

	const [email, setEmail]: [string, any] = useState('');
	const [password, setPassword]: [string, any] = useState('');

	const handleSignUp = () => {
		console.log(email)
		firebase.auth().createUserWithEmailAndPassword(email, password)
			.then((res) => {
				console.log(res)
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