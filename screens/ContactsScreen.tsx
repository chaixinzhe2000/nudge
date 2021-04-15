import * as React from 'react';
import { useState, useEffect } from 'react';
import { ScrollView, SectionList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AddContactModal from '../components/AddContactModal';
import IndividualTaskList from '../components/IndividualTaskList';
import ProfileImage from '../components/ProfileImage';
import { Text, View } from '../components/Themed';
import * as firebase from 'firebase'


export default function ContactsScreen(props) {
  const [contactsList, setContactList]:[IContact[], any] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  var getContacts = firebase.functions().httpsCallable('getContacts');

  useEffect(() => {
		async function getContactsCaller() {
      let getContactsRes = await getContacts();
      if (getContactsRes.data.status) {
        setContactList(getContactsRes.data.contacts);
      }
		}
		getContactsCaller();
	  },[])

	// const contactsListElement = contactsList.map((contact: IContact) => {
  //   <TouchableOpacity onPress={e => {}} key={contact.uid}>
	// 		<Image
	// 			style={styles.profileImage}
	// 			source={{ uri: contact.avatar ? contact.avatar : 'https://i.pinimg.com/originals/5d/70/18/5d70184dfe1869354afe7bf762416603.jpg' }}
	// 		/>
  //     <Text>{contact.displayName}</Text>
  //     <Text>{contact.email}</Text>
	// 	</TouchableOpacity>
  // });
		

	interface IContact {
		uid: number,
		displayName: string,
		email: string,
    avatar: string
	}

	interface ISelectedContact {
		title: string,
		data: IContact[]
	}

	let getData = () => {
		let contactsArr: ISelectedContact[] = [];
		let aCode = "A".charCodeAt(0);
		for (let i = 0; i < 26; i++) {
			let currChar = String.fromCharCode(aCode + i);
			let obj: ISelectedContact = {
				title: currChar,
				data: []
			};

			let currContacts = contactsList.filter(item => {
				return item.displayName[0].toUpperCase() === currChar;
			});
			if (currContacts.length > 0) {
				currContacts.sort((a, b) => a.displayName.localeCompare(b.displayName));
				obj.data = currContacts;
				contactsArr.push(obj);
			}
		}
		return contactsArr;
	};

  	return (
    <>
<<<<<<< HEAD
    <View style={{ backgroundColor: 'white', flex: 1}}>
=======
    <View style={{ backgroundColor: 'white', flex: 1 }}>
>>>>>>> 1df30d428e131966d76b25b2940964db6926b9e8
      <AddContactModal setAddContactModalOpen={props.setAddContactModalOpen} addContactModalOpen={props.addContactModalOpen} />
      <SectionList sections={getData()}
	  		renderItem={({ item }) => (
				  <>
				  <View style={styles.contactContainer}>
				  	<Image
						style={styles.profileImage}
						source={{ uri: item.avatar }}
					/>
				  	<View style={styles.rowContainer}>
					  	<Text style={styles.name}>{item.displayName}</Text>
						<Text style={styles.email}>{item.email.toLowerCase()}</Text>
				  	</View>
				  </View>
				  <View style={styles.separator}></View>
				  </>
			)}
			keyExtractor={item => item.uid.toString()}
			renderSectionHeader={({ section }) => (
				<View style={styles.sectionHeader}>
					<Text style={styles.sectionText}>{section.title}</Text>
				</View>
			)}
			style={styles.container}
		/>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
	display: 'flex',
	backgroundColor: 'white'
  },
  contactContainer: {
	display: 'flex',
	flexDirection: 'row',
	minHeight: 65,
	alignItems: 'center'
  },
  profileImage: {
	marginLeft: 18,
	width: 40,
	height: 40,
	marginRight: 10,
	borderRadius: 90
  },
  rowContainer: {
	display: 'flex',
	justifyContent: 'center',
	backgroundColor: 'white'
  },
  name: {
	fontSize: 17,
	fontWeight: '600'
  },
  email: {
	paddingTop: 1,
	fontSize: 15,
	color: '#8f8f8f',
	fontWeight: '500'
  },
  sectionHeader: {
	display: 'flex',
	justifyContent: 'center',
    backgroundColor: '#2cb9b0',
	paddingLeft: 10,
	minHeight: 25,
	zIndex: 1,
	marginTop: -1
  },
  sectionText: {
	color: 'white',
	fontSize: 15,
	fontWeight: '700'
  },
  separator: {
    height: 1,
    width: '95%',
	backgroundColor: '#959595',
	marginLeft: '2.5%',
	marginRight: '2.5%',
	zIndex: 0
  },
});
