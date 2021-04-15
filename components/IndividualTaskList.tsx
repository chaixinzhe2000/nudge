import moment from 'moment';
import React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import TaskBox from './TaskBox';

const IndividualTaskList = () => {
	return (
		<View
			style={styles.viewContainer}
			>
			<Image
				style={styles.profileImage}
				source={{ uri: 'https://i.pinimg.com/originals/5d/70/18/5d70184dfe1869354afe7bf762416603.jpg' }}
			/>
			<View style={styles.taskList}>
				<Text style={styles.name}>Xinzhe</Text>
				<TaskBox priority='normal' title='Ship FedEx package' dueDate={moment('2021-04-15 23:59:00')}/>
				<TaskBox priority='high' title='Review TA application' dueDate={moment('2021-04-16 09:00:00')}/>
				<TaskBox priority='normal' title='Prep for Calc BC' dueDate={moment('2021-04-27 10:00:00')}/>
				<TaskBox priority='completed' title='Pick up dinner plz' dueDate={moment('2021-03-31 11:59:00')}/>
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