import React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';

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
				<Text>Nuj Nuj</Text>
				<View style={styles.rectangle}></View>
				<View style={styles.rectangle}></View>
				<View style={styles.rectangle}></View>
				<View style={styles.rectangle}></View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 50,
	},
	profileImage: {
		width: 60,
		height: 60,
		paddingRight: 20,
		borderRadius: 90
	},
	viewContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		display: "flex",
		flexDirection: "row"
	},
	rectangle: {
		flex: 1,
		height: 30,
		width: 300,
		borderColor: 'green',
		borderWidth: 3,
	},
});
export default IndividualTaskList;