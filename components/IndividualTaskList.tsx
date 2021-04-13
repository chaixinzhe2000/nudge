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
				<TaskBox priority='normal' title='Ship FedEx package' dueDate={new Date()}/>
				<TaskBox priority='high' title='Review TA application' dueDate={new Date()}/>
				<TaskBox priority='completed' title='Pick up dinner plz' dueDate={new Date()}/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	profileImage: {
		width: 60,
		height: 60,
		marginLeft: 12,
		marginRight: 10,
		borderRadius: 90
	},
	name: {
		fontWeight: 'bold',
		fontSize: 17
	},
	viewContainer: {
		paddingBottom: 15,
		flex: 1,
		justifyContent: "center",
		alignItems: "flex-start",
		display: "flex",
		flexDirection: "row",
		marginRight: 18
	},
});
export default IndividualTaskList;