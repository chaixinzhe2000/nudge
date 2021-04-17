import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import AddContactModal from '../components/AddContactModal';
import IndividualTaskList from '../components/IndividualTaskList';
import ProfileImage from '../components/ProfileImage';
import { Text, View } from '../components/Themed';
import * as firebase from 'firebase'
import TaskModal from '../components/TaskModal';

export default function InboxScreen(props) {

	var getReceivedTasks = firebase.functions().httpsCallable('getReceivedTasks');

	React.useEffect(() => {
		async function getTasksCaller() {
			let taskResponse = await getReceivedTasks();
			if (taskResponse.data.status) {
				setTaskBySenderMap(taskResponse.data.tasks)
				setListOfSenders(taskResponse.data.listOfSenders);
			}
		}
		setInterval(() => getTasksCaller(), 2000)
	}, [])

	const [taskBySenderMap, setTaskBySenderMap] = React.useState(new Map());
	const [listOfSenders, setListOfSenders] = React.useState([]);
	const [selectedTask, setSelectedTask] = React.useState({});
	const [taskModalOpen, setTaskModalOpen] = React.useState(false);
	const [selectedUser, setSelectedUser] = React.useState({});

	const TasksGroup = listOfSenders.map((user: any) =>
		<IndividualTaskList
			user={user} setSelectedUser={setSelectedUser}
			selectedTask={selectedTask} setSelectedTask={setSelectedTask}
			taskModalOpen={taskModalOpen} setTaskModalOpen={setTaskModalOpen}
			key={user.uid} profileImg={user.avatar} name={user.displayName} uid={user.uid} taskList={taskBySenderMap} />
	)

	const HorizontalAvatar = listOfSenders.map((user: any) =>
		<ProfileImage key={user.uid} profileImg={user.avatar} name={user.displayName} uid={user.uid} />
	)

	return (
		<>
			{listOfSenders.length === 0 ?
				<View>
					<Text>No contacts found</Text>
				</View> :
				<ScrollView style={{ backgroundColor: 'white' }}>
					<TaskModal setTaskModalOpen={setTaskModalOpen} taskModalOpen={taskModalOpen}
						selectedTask={selectedTask} setSelectedTask={setSelectedTask}
						selectedUser={selectedUser} setSelectedUser={setSelectedUser}
					/>
					<AddContactModal setAddContactModalOpen={props.setAddContactModalOpen} addContactModalOpen={props.addContactModalOpen} />
					<Text style={styles.favorites}>Recents</Text>
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
			}
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
