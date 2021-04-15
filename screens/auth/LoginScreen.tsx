import React, { useEffect } from "react";
import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import * as firebase from 'firebase/app';
import { Feather } from '@expo/vector-icons';
import ForgotPasswordModal from "./ForgotPasswordModal";

function FeatherIcon(props: { name: React.ComponentProps<typeof Feather>['name']; color: string }) {
  return <Feather size={24} style={{ marginBottom: -3 }} {...props} />;
}

function LoginScreen() {

  const [email, setEmail]: [string, any] = useState('');
  const [errorMessage, setErrorMessage]: [string, any] = useState('');
  const [password, setPassword]: [string, any] = useState('');
  const [forgotPasswordModalOpen, setForgotPasswordModalOpen]: [boolean, any] = useState(false);


  const handleLogin = () => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((res) => {
        console.log('succesfully logged in')
      })
      .catch((err) => {
        console.log(err)
        setErrorMessage("Incorrect username or password!")
      })
  }

  return (
    <View style={styles.container}>
		<View style={{display: 'flex', alignItems: 'center'}}>
			<Text style={styles.welcome}>Good to see you</Text>
			<Text style={styles.nudge}>again.</Text>
		</View>
      <ForgotPasswordModal forgotPasswordModalOpen={forgotPasswordModalOpen} setForgotPasswordModalOpen={setForgotPasswordModalOpen} />
      <TextInput
        placeholder="Your Email" placeholderTextColor='white' textAlign='center' style={styles.input}
        onChangeText={(text) => {setEmail(text); setErrorMessage('');}} />
      <TextInput
        placeholder="Password" placeholderTextColor='white' textAlign='center' style={styles.input}
        secureTextEntry={true} onChangeText={(text) => {setPassword(text); setErrorMessage('');}} />
        
      <TouchableOpacity onPress={() => { setForgotPasswordModalOpen(true) }} >
        <Text style={styles.forgot}>FORGOT PASSWORD?</Text>
      </TouchableOpacity>

      <Text style={styles.error}>
        {errorMessage}
      </Text>

      <TouchableOpacity onPress={() => { handleLogin() }} >
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
    marginBottom: 60
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
  forgot: {
	color: 'white',
	fontSize: 15,
	paddingTop: 3,
	fontWeight: '700',
	paddingLeft: 8
  },
  error: {
	fontSize: 15,
	paddingTop: 3,
	color: '#e93342',
	fontWeight: '500',
	paddingLeft: 8
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