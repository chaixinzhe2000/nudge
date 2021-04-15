import moment from 'moment';
import React from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import TaskBox from './TaskBox';
import { useState } from 'react';
import TaskModal from '../components/TaskModal';
import * as firebase from 'firebase'
import 'firebase/firestore';

const IndividualTaskList = (props) => {

	const TaskList = props.taskList[props.uid].map((task: any, i) =>
		<TouchableOpacity onPress={() => { props.setTaskModalOpen(true); props.setSelectedTask(task); props.setSelectedUser(props.user) }} key={i}>
			<TaskBox priority={task.priority} title={task.taskName} dueDate={new firebase.firestore.Timestamp(task.due._seconds, task.due._nanoseconds).toDate()} />
		</TouchableOpacity>
	)

	return (
		<View style={styles.viewContainer}>
			<Image
				style={styles.profileImage}
				source={{ uri: props.profileImg }}
			/>
			<View style={styles.taskList}>
				<Text style={styles.name}>{props.name}</Text>
				{TaskList}
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