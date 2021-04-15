import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import AddContactModal from '../components/AddContactModal';
import IndividualTaskList from '../components/IndividualTaskList';
import ProfileImage from '../components/ProfileImage';
import TaskBox from '../components/TaskBox';
import { Text, View } from '../components/Themed';
import * as firebase from 'firebase'

export default function SentScreen(props) {

	var getSentTasks = firebase.functions().httpsCallable('getSentTasks');

	React.useEffect(() => {
		async function getTasksCaller() {
			let taskResponse = await getSentTasks();
			if (taskResponse.data.status) {
				setTaskByReceiverMap(taskResponse.data.tasks)
				setListOfReceivers(taskResponse.data.listOfReceivers);
			}
		}
		getTasksCaller();
	}, [])

	const [taskByReceiverMap, setTaskByReceiverMap] = React.useState(new Map());
	const [listOfReceivers, setListOfReceivers] = React.useState([]);


	const TasksGroup = listOfReceivers.map((user: any) =>
		<IndividualTaskList key={user.uid} profileImg={user.avatar} name={user.displayName} uid={user.uid} taskList={taskByReceiverMap} />
	)

	const HorizontalAvatar = listOfReceivers.map((user: any) =>
		<ProfileImage key={user.uid} profileImg={user.avatar} name={user.displayName} uid={user.uid} />
	)

	return (
		<>
			<ScrollView style={{ backgroundColor: 'white' }}>
				<AddContactModal setAddContactModalOpen={props.setAddContactModalOpen} addContactModalOpen={props.addContactModalOpen} />
				<Text style={styles.favorites}>Favorites</Text>
				<ScrollView horizontal={true}
					contentContainerStyle={styles.favoritesContainer}
					showsHorizontalScrollIndicator={false}
				>
					{HorizontalAvatar}
				</ScrollView>
				<View style={styles.scrollContainer}>
					{TasksGroup}
				</View>
			</ScrollView>
		</>
	);
}

const styles = StyleSheet.create({
	favorites: {
		paddingTop: 10,
		backgroundColor: 'white',
		fontSize: 17,
		fontWeight: '500',
		paddingLeft: 15,
	},
	favoritesContainer: {
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		flexDirection: 'row',
		backgroundColor: 'white',
		height: 100,
		paddingTop: 10,
		paddingLeft: 12,
		marginBottom: 20
	},
	scrollContainer: {
		flex: 1,
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		flexDirection: 'column',
		backgroundColor: 'white',
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
