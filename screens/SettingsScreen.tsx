import * as React from 'react';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView, StyleSheet, TextInput } from 'react-native';
import { useState } from 'react';
import * as firebase from 'firebase'
import 'firebase/firestore';


export default function SettingsScreen() {

  function handleSignout() {
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Button
        icon={
          <Icon
            name="arrow-right"
            size={15}
            color="white"
          />
        }
        buttonStyle={styles.submitButton}
        title="Sign Out"
        onPress={() => handleSignout()}

      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    borderColor: 'blue',
    borderWidth: 3,
  },
  submitButton: {
    width: '90%',
    margin: '5%',
    borderWidth: 1,
    borderColor: 'blue',
  }
});
