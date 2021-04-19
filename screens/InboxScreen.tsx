import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import AddContactModal from '../components/AddContactModal';
import IndividualTaskList from '../components/IndividualTaskList';
import ProfileImage from '../components/ProfileImage';
import { Text, View } from '../components/Themed';
import * as firebase from 'firebase'
import TaskModal from '../components/TaskModal';
import ViewContactsTasksModal from '../components/ViewContactsTasksModal';

export default function InboxScreen(props) {

	var getReceivedTasks = firebase.functions().httpsCallable('getReceivedTasks');

	React.useEffect(() => {
		async function getTasksCaller() {
			let taskResponse = await getReceivedTasks();
			if (taskResponse.data.status) {
				setTaskBySenderMap(taskResponse.data.tasks)
				console.log(taskResponse.data.tasks)
			}
		}
		setInterval(() => getTasksCaller(), 2000)
	}, [])

	const [taskBySenderMap, setTaskBySenderMap] = React.useState(new Map());
	const [selectedTask, setSelectedTask] = React.useState({});
	const [taskModalOpen, setTaskModalOpen] = React.useState(false);
	const [selectedUser, setSelectedUser] = React.useState({});
	const [selectedContact, setSelectedContact] = React.useState({ uid: "", displayName: "", email: "", avatar: "" });
	const [addViewContactsTasksModalOpen, setAddViewContactsTasksModalOpen] = React.useState(false);

	const allElement = () => {
		let allElementArray: any = []
		const allKeys = Object.keys(taskBySenderMap);
		for (let i = 0; i < allKeys.length; i++) {
			const myObject = taskBySenderMap[allKeys[i]];
			const individualElement = (
				<IndividualTaskList
					user={myObject["user"]} setSelectedUser={setSelectedUser}
					selectedTask={selectedTask} setSelectedTask={setSelectedTask}
					taskModalOpen={taskModalOpen} setTaskModalOpen={setTaskModalOpen}
					key={myObject["user"].uid} profileImg={myObject["user"].avatar} name={myObject["user"].displayName} uid={myObject["user"].uid} taskList={myObject["tasks"]} />
			)
			allElementArray.push(individualElement);
		}
		return (
			<View>
				{allElementArray}
			</View>
		)
	}

	const recentContacts = () => {
		let allElementArray: any = []
		const allKeys = Object.keys(taskBySenderMap);
		for (let i = 0; i < allKeys.length; i++) {
			const myObject = taskBySenderMap[allKeys[i]]["user"];
			const individualElement = (
				<ProfileImage 
					key={myObject.uid} profileImg={myObject.avatar} name={myObject.displayName} 
					uid={myObject.uid} email={myObject.email} setSelectedContact={setSelectedContact}
					setAddViewContactsTasksModalOpen={setAddViewContactsTasksModalOpen} />
			)
			allElementArray.push(individualElement);
		}
		return (
			<View>
				{allElementArray}
			</View>
		)
	}

	return (
		<>
			{Object.keys(taskBySenderMap).length === 0 ?
				<View style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
					<AddContactModal setAddContactModalOpen={props.setAddContactModalOpen} addContactModalOpen={props.addContactModalOpen} />
					<Text style={{ margin: 15, fontSize: 18, fontWeight: '500' }}>
						You have no tasks due!
					</Text>
				</View> :
				<ScrollView style={{ backgroundColor: 'white' }}>
					<ViewContactsTasksModal addViewContactsTasksModalOpen={addViewContactsTasksModalOpen} setAddViewContactsTasksModalOpen={setAddViewContactsTasksModalOpen}
						selectedContact={selectedContact} />
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
						{recentContacts()}
					</ScrollView>
					<View style={styles.scrollContainer}>
						{allElement()}
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
		marginTop: 5

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
