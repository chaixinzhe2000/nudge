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
				source={{ uri: 'https://st2.depositphotos.com/1009634/7235/v/600/depositphotos_72350117-stock-illustration-no-user-profile-picture-hand.jpg' }}
			/>
			<View>
				<Text style={styles.name}>Xinzhe</Text>
				<TaskBox priority='normal' title='Ship FedEx package' dueDate={moment('2021-04-23 11:59:00')}/>
				<TaskBox priority='high' title='Review TA application' dueDate={moment('2021-04-30 09:00:00')}/>
				<TaskBox priority='completed' title='Pick up dinner plz' dueDate={moment('2021-03-31 11:59:00')}/>
			</View>
		</View>
)
}

const styles = StyleSheet.create({
	profileImage: {
		width: 55,
		height: 55,
		marginLeft: 17,
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
		justifyContent: "center",
		alignItems: "flex-start",
		display: "flex",
		flexDirection: "row",
		marginRight: 15
	},
});
export default IndividualTaskList;