import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import AddContactModal from '../components/AddContactModal';
import IndividualTaskList from '../components/IndividualTaskList';
import ProfileImage from '../components/ProfileImage';
import TaskBox from '../components/TaskBox';
import { Text, View } from '../components/Themed';
import * as firebase from 'firebase'
import TaskModal from '../components/TaskModal';
import TaskModalSender from '../components/TaskModalSender';

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
		setInterval(() => getTasksCaller(), 2000)
	}, [])

	const [taskByReceiverMap, setTaskByReceiverMap] = React.useState(new Map());
	const [listOfReceivers, setListOfReceivers] = React.useState([]);

	const [selectedTask, setSelectedTask] = React.useState({});
	const [taskModalOpen, setTaskModalOpen] = React.useState(false);
	const [selectedUser, setSelectedUser] = React.useState({});


	const TasksGroup = listOfReceivers.map((user: any) =>
		<IndividualTaskList

			user={user} setSelectedUser={setSelectedUser}
			selectedTask={selectedTask} setSelectedTask={setSelectedTask}
			taskModalOpen={taskModalOpen} setTaskModalOpen={setTaskModalOpen}

			key={user.uid} profileImg={user.avatar} name={user.displayName} uid={user.uid} taskList={taskByReceiverMap} />
	)

	const HorizontalAvatar = listOfReceivers.map((user: any) =>
		<ProfileImage key={user.uid} profileImg={user.avatar} name={user.displayName} uid={user.uid} />
	)

	return (
		<>
			{listOfReceivers.length === 0  ?
				<View>
					<Text>No contacts found</Text>
				</View> :
				<ScrollView style={{ backgroundColor: 'white' }}>
					<TaskModalSender setTaskModalOpen={setTaskModalOpen} taskModalOpen={taskModalOpen}
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
