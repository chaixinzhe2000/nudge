import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import AddContactModal from '../components/AddContactModal';
import IndividualTaskList from '../components/IndividualTaskList';
import ProfileImage from '../components/ProfileImage';
import TaskBox from '../components/TaskBox';
import { Text, View } from '../components/Themed';

export default function SentScreen(props) {
	return (
    <>
		<ScrollView>
    <AddContactModal setAddContactModalOpen={props.setAddContactModalOpen} addContactModalOpen={props.addContactModalOpen} />
			<ScrollView horizontal={true}
				contentContainerStyle={styles.favoritesContainer}
				showsHorizontalScrollIndicator={false}
			>
				<ProfileImage />
				<ProfileImage />
				<ProfileImage />
				<ProfileImage />
				<ProfileImage />
				<ProfileImage />
				<ProfileImage />
				<ProfileImage />
				<ProfileImage />
				<ProfileImage />
				<ProfileImage />
			</ScrollView>
			<View style={styles.scrollContainer}>
				<IndividualTaskList />
				<IndividualTaskList />
				<IndividualTaskList />
				<IndividualTaskList />
				<IndividualTaskList />
				<IndividualTaskList />
				<IndividualTaskList />
				<IndividualTaskList />
				<IndividualTaskList />
			</View>
		</ScrollView>
    </>
	);
}

const styles = StyleSheet.create({
	favoritesContainer: {
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		flexDirection: 'row',
		backgroundColor: 'white',
		height: 100,
		borderColor: 'red',
		borderWidth: 3
	},
	scrollContainer: {
		flex: 1,
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		flexDirection: 'column',
		backgroundColor: 'white',
		borderColor: 'blue',
		borderWidth: 3,
		height: '100%',
		width: '100%',

	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%',
	},
});
