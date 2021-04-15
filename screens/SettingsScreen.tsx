import * as React from 'react';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View, Text, Image } from 'react-native';
import { useState, useEffect } from 'react';
import * as firebase from 'firebase'
import 'firebase/firestore';
import { Feather } from '@expo/vector-icons';
import ChangeNameModal from '../components/ChangeNameModal';
import ChangePasswordModal from '../components/ChangePasswordModal';
import getCameraPermissions from '../util/UserPermission';
import * as ImagePicker from 'expo-image-picker';


function FeatherIcon(props: { name: React.ComponentProps<typeof Feather>['name']; color: string }) {
	return <Feather size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function SettingsScreen() {
	const dbh = firebase.firestore();
  const user = firebase.auth().currentUser;
  const [changeNameModalOpen, setChangeNameModalOpen] = useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [imageUri, setImageUri] = useState("https://www.labelprint.co.za/wp-content/uploads/2018/11/user-icon-image-placeholder-300-grey.jpg");

  useEffect(() => {
    async function getProfileImageCaller() {
      if (user) {
        const userDoc = await dbh.collection("User").doc(user.uid).get();
        setImageUri(userDoc.get("avatar"));
      }
    }
    getProfileImageCaller();
  }, [])

  function handleSignOut() {
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
  }

  const handlePickAvatar = async () => {
    let remoteUri: string = '';
		getCameraPermissions();
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3]
		})

		if (!result.cancelled && user) {
			setImageUri(result.uri)
      if (imageUri !== '') {
				remoteUri = await uploadPhotoAsync(imageUri, `avatars/${user.uid}`);
				await dbh.collection("User").doc(user.uid).update({ avatar: remoteUri });
			}
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



  return (
    <SafeAreaView style={styles.mainContainer}>
      <ChangeNameModal setChangeNameModalOpen={setChangeNameModalOpen} changeNameModalOpen={changeNameModalOpen} />
      <ChangePasswordModal setChangePasswordModalOpen={setChangePasswordModalOpen} changePasswordModalOpen={changePasswordModalOpen} />
    
      <View style={styles.userContainer}>
        <TouchableOpacity onPress={handlePickAvatar} >
          <Image
            style={styles.profileImage}
            source={{ uri: imageUri}}
          />
        </TouchableOpacity>
        <Text style={styles.name}>{user !== null ? user.displayName : ""}</Text>
      </View>

		<TouchableOpacity onPress={() => {setChangeNameModalOpen(true)}} >
			<View style={styles.nameDiv}>
				<Text style={styles.altText}>Change Name</Text>
				<FeatherIcon name="chevron-right" color='#2cb9b0' />
			</View>
        </TouchableOpacity>
		<View style={styles.separator}></View>
		<TouchableOpacity onPress={() => {setChangePasswordModalOpen(true)}} >
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
