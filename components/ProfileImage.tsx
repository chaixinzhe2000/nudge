import React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';

const ProfileImage = () => {
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center"
			}}>
			<Image
				style={styles.stretch}
				source={{uri: 'https://st2.depositphotos.com/1009634/7235/v/600/depositphotos_72350117-stock-illustration-no-user-profile-picture-hand.jpg'}}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 50,
	},
	stretch: {
		width: 60,
		height: 60,
		paddingRight: 20,
		borderRadius: 90
	},
});
export default ProfileImage;