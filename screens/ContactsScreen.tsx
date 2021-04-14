import * as React from 'react';
import { ScrollView, SectionList, StyleSheet, Image } from 'react-native';
import AddContactModal from '../components/AddContactModal';
import IndividualTaskList from '../components/IndividualTaskList';
import ProfileImage from '../components/ProfileImage';
import { Text, View } from '../components/Themed';

export default function ContactsScreen(props) {
	const contacts: IContact[] = [
		{
			index: 0,
			name: "Cal Chen",
			email: "catherine_chen@brown.edu"
		},
		{
			index: 1,
			name: "Xinzhe Chai",
			email: "xinzhe_chai@brown.edu"
		},
		{
			index: 2,
			name: "Jinoo Hong",
			email: "jinoo_hong@brown.edu"
		},
		{
			index: 3,
			name: "Elliot Hong",
			email: "elliot_hong@brown.edu"
		},
		{
			index: 4,
			name: "Eddard Stark",
			email: "eddard_stark@got.com"
		},
		{
			index: 5,
			name: "Robert Baratheon",
			email: "robert_baratheon@got.com"
		},
		{
			index: 6,
			name: "Jaime Lannister",
			email: "jaime_lannister@got.com"
		},
		{
			index: 7,
			name: "Cersei Lannister",
			email: "cersei_lannister@got.com"
		},
		{
			index: 8,
			name: "Daenerys Targaryen",
			email: "daenerys_targaryen@got.com"
		},
		{
			index: 9,
			name: "Arya Stark",
			email: "arya_stark@got.com"
		},
		{
			index: 10,
			name: "Sandor Clegane",
			email: "the_hound@got.com"
		},
		{
			index: 11,
			name: "Petyr Baelish",
			email: "little_finger@got.com"
		}
	]

	interface IContact {
		index: number,
		name: string,
		email: string
	}

	interface ISelectedContacts {
		title: string,
		data: IContact[]
	}

	let getData = () => {
		let contactsArr: ISelectedContacts[] = [];
		let aCode = "A".charCodeAt(0);
		for (let i = 0; i < 26; i++) {
			let currChar = String.fromCharCode(aCode + i);
			let obj: ISelectedContacts = {
				title: currChar,
				data: []
			};

			let currContacts = contacts.filter(item => {
				return item.name[0].toUpperCase() === currChar;
			});
			if (currContacts.length > 0) {
				currContacts.sort((a, b) => a.name.localeCompare(b.name));
				obj.data = currContacts;
				contactsArr.push(obj);
			}
		}
		return contactsArr;
	};

  	return (
    <>
    <View style={{ backgroundColor: 'white' }}>
      <AddContactModal setAddContactModalOpen={props.setAddContactModalOpen} addContactModalOpen={props.addContactModalOpen} />
      <SectionList sections={getData()}
	  		renderItem={({ item }) => (
				  <>
				  <View style={styles.contactContainer}>
				  	<Image
						style={styles.profileImage}
						source={{ uri: 'https://i.pinimg.com/originals/5d/70/18/5d70184dfe1869354afe7bf762416603.jpg' }}
					/>
				  	<View style={styles.rowContainer}>
					  	<Text style={styles.name}>{item.name}</Text>
						<Text style={styles.email}>{item.email.toLowerCase()}</Text>
				  	</View>
				  </View>
				  <View style={styles.separator}></View>
				  </>
			)}
			keyExtractor={item => item.index.toString()}
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
	marginTop: 10,
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
