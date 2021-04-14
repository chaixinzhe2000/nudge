import * as React from 'react';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View, Text } from 'react-native';
import { useState } from 'react';
import * as firebase from 'firebase'
import 'firebase/firestore';
import { Feather } from '@expo/vector-icons';

function FeatherIcon(props: { name: React.ComponentProps<typeof Feather>['name']; color: string }) {
	return <Feather size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function SettingsScreen() {

  function handleSignOut() {
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
		<TouchableOpacity onPress={() => {handleSignOut()}} >
			<View style={styles.buttonDiv}>
				<Text style={styles.text}>SIGN OUT</Text>
				<FeatherIcon name="arrow-right" color='white' />
			</View>
        </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
	backgroundColor: 'white'
  },
  buttonDiv: {
    width: '90%',
    margin: '5%',
	backgroundColor: '#2cb9b0',
	minHeight: 50,
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	flexDirection: 'row',
	borderRadius: 10,
	marginBottom: 12,
	paddingRight: 10,
	marginTop: 30
  },
  text: {
	color: 'white',
	marginLeft: 15,
	fontSize: 18,
	fontWeight: '700'
  }
});
