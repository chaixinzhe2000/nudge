import React, { useEffect } from "react";
import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import * as firebase from 'firebase/app';
import { Feather } from '@expo/vector-icons';

function FeatherIcon(props: { name: React.ComponentProps<typeof Feather>['name']; color: string }) {
	return <Feather size={24} style={{ marginBottom: -3 }} {...props} />;
}

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
		<View style={styles.container}>
			<TextInput
				placeholder="Your Email" placeholderTextColor='white' textAlign='center' style={styles.input}
				onChangeText={(text) => setEmail(text)} />
			<TextInput
				placeholder="Password" placeholderTextColor='white' textAlign='center' style={styles.input}
				secureTextEntry={true} onChangeText={(text) => setPassword(text)} />
				<TouchableOpacity onPress={() => {handleLogin()}} >
				<View style={styles.buttonDiv}>
					<Text style={styles.text}>ENTER THE NUDGE ZONE</Text>
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

export default LoginScreen;