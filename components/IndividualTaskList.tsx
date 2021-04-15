import moment from 'moment';
import React from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import TaskBox from './TaskBox';
import { useState } from 'react';
import TaskModal from '../components/TaskModal';

const IndividualTaskList = (props) => {
	const [taskModalOpen, setTaskModalOpen] = useState(false);

	return (
		<View style={styles.viewContainer}>
			<TaskModal setTaskModalOpen={setTaskModalOpen} taskModalOpen={taskModalOpen} />
			<Image
				style={styles.profileImage}
				source={{ uri: props.profileImg }}
			/>
			<View style={styles.taskList}>
				<Text style={styles.name}>{props.name}</Text>
				<TouchableOpacity onPress={() => { setTaskModalOpen(true) }} >
					<TaskBox priority='normal' title='Ship FedEx package' dueDate={moment('2021-04-14 23:59:00')}/>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => { setTaskModalOpen(true) }} >
					<TaskBox priority='high' title='Review TA application' dueDate={moment('2021-04-15 09:00:00')}/>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => { setTaskModalOpen(true) }} >
					<TaskBox priority='normal' title='Prep for Calc BC' dueDate={moment('2021-04-27 10:00:00')}/>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => { setTaskModalOpen(true) }} >
					<TaskBox priority='completed' title='Pick up dinner plz' dueDate={moment('2021-03-31 11:59:00')}/>
				</TouchableOpacity>
			</View>
		</View>
)
}

const styles = StyleSheet.create({
	profileImage: {
		width: 55,
		height: 55,
		marginRight: 10,
		borderRadius: 90
	},
	name: {
		fontWeight: '600',
		fontSize: 17
	},
	viewContainer: {
		paddingBottom: 15,
		flex: 1,
		width: '100%',
		justifyContent: "center",
		alignItems: "flex-start",
		display: "flex",
		flexDirection: "row",
		paddingLeft: 10,
		paddingRight: 10
	},
	taskList: {
		flex: 1
	}
});
export default IndividualTaskList;