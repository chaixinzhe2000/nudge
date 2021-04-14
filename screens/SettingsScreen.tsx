import * as React from 'react';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View, Text, Image } from 'react-native';
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
		<View style={styles.userContainer}>
			<Image
				style={styles.profileImage}
				source={{ uri: 'https://i.pinimg.com/originals/5d/70/18/5d70184dfe1869354afe7bf762416603.jpg' }}
			/>
			<Text style={styles.name}>Xinzhe Chai</Text>
		</View>
		<TouchableOpacity onPress={() => {handleSignOut()}} >
			<View style={styles.nameDiv}>
				<Text style={styles.altText}>Change Name</Text>
				<FeatherIcon name="chevron-right" color='#2cb9b0' />
			</View>
        </TouchableOpacity>
		<View style={styles.separator}></View>
		<TouchableOpacity onPress={() => {handleSignOut()}} >
			<View style={styles.passDiv}>
				<Text style={styles.altText}>Change Password</Text>
				<FeatherIcon name="chevron-right" color='#2cb9b0' />
			</View>
        </TouchableOpacity>
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
    justifyContent: 'flex-start',
	backgroundColor: 'white',
  },
  userContainer: {
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center'
  },
  profileImage: {
	marginTop: 35,
	width: 100,
	height: 100,
	borderRadius: 90
  },
  name: {
	paddingTop: 13,
	fontWeight: '700',
	fontSize: 18
  },
  nameDiv: {
    width: '92%',
	minHeight: 50,
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	flexDirection: 'row',
	paddingLeft: 10,
	marginTop: 30
  },
  passDiv: {
    width: '92%',
	minHeight: 45,
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	flexDirection: 'row',
	paddingLeft: 10
  },
  altText: {
	color: 'black',
	marginLeft: 15,
	fontSize: 19,
	fontWeight: '700'
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
  },
  separator: {
	height: 1,
	backgroundColor: '#dadada',
	width: '85%',
	marginLeft: '6%',
	marginRight: '9%'
  }
});
