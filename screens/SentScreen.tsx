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
import ViewContactsTasksModal from '../components/ViewContactsTasksModal';
import { useState } from 'react';

export default function SentScreen(props) {

	var getSentTasks = firebase.functions().httpsCallable('getSentTasks');

	React.useEffect(() => {
		async function getTasksCaller() {
			let taskResponse = await getSentTasks();
			if (taskResponse.data.status) {
				setTaskByReceiverMap(taskResponse.data.tasks)
			}
		}
		setInterval(() => getTasksCaller(), 2000)
	}, [])

	interface IContact {
		uid: string,
		displayName: string,
		email: string,
		avatar: string
	}

	const [taskByReceiverMap, setTaskByReceiverMap] = React.useState(new Map());
	const [selectedTask, setSelectedTask] = React.useState({});
	const [taskModalOpen, setTaskModalOpen] = React.useState(false);
	const [selectedUser, setSelectedUser] = React.useState({});

	const [selectedContact, setSelectedContact]: [IContact, any] = React.useState({ uid: "", displayName: "", email: "", avatar: "" });
	const [addViewContactsTasksModalOpen, setAddViewContactsTasksModalOpen] = useState(false);

	const allElement = () => {
		let allElementArray: any = []
		const allKeys = Object.keys(taskByReceiverMap);
		for (let i = 0; i < allKeys.length; i++) {
			const myObject = taskByReceiverMap[allKeys[i]];
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
		const allKeys = Object.keys(taskByReceiverMap);
		for (let i = 0; i < allKeys.length; i++) {
			const myObject = taskByReceiverMap[allKeys[i]]["user"];
			const individualElement = (
				<ProfileImage
					key={myObject.uid} profileImg={myObject.avatar} name={myObject.displayName}
					uid={myObject.uid} email={myObject.email} setSelectedContact={setSelectedContact}
					setAddViewContactsTasksModalOpen={setAddViewContactsTasksModalOpen} />
			)
			allElementArray.push(individualElement);
		}
		return (
			<ScrollView horizontal={true}
				contentContainerStyle={styles.favoritesContainer}
				showsHorizontalScrollIndicator={false}
			>
				{allElementArray}
			</ScrollView>
		)
	}

	return (
		<>
			{Object.keys(taskByReceiverMap).length === 0 ?
				<View style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
					<AddContactModal setAddContactModalOpen={props.setAddContactModalOpen} addContactModalOpen={props.addContactModalOpen} />
					<Text style={styles.noTasks}>
						No tasks assigned by you are due!
					</Text>
				</View> :
				<ScrollView style={{ backgroundColor: 'white' }}>
					<TaskModalSender setTaskModalOpen={setTaskModalOpen} taskModalOpen={taskModalOpen}
						selectedTask={selectedTask} setSelectedTask={setSelectedTask}
						selectedUser={selectedUser} setSelectedUser={setSelectedUser}
					/>
					<ViewContactsTasksModal addViewContactsTasksModalOpen={addViewContactsTasksModalOpen} setAddViewContactsTasksModalOpen={setAddViewContactsTasksModalOpen}
						selectedContact={selectedContact} />
					<AddContactModal setAddContactModalOpen={props.setAddContactModalOpen} addContactModalOpen={props.addContactModalOpen} />
					<Text style={styles.favorites}>Recents</Text>

					{recentContacts()}

					<View style={styles.scrollContainer}>
						{allElement()}
					</View>
				</ScrollView>
			}
		</>
	);
}

const styles = StyleSheet.create({
	noTasks: {
		margin: 15,
		fontSize: 18,
		fontWeight: '500'
	},
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
