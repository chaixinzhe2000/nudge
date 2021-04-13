import React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';

const ProfileImage = () => {
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				marginRight: 12
			}}>
			<Image
				style={styles.stretch}
				source={{uri: 'https://st2.depositphotos.com/1009634/7235/v/600/depositphotos_72350117-stock-illustration-no-user-profile-picture-hand.jpg'}}
			/>
			<Text style={styles.name}>Xinzhe</Text>
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
		borderRadius: 90,
		borderColor: '#2cb980',
		borderWidth: 2
	},
	name: {
		paddingTop: 3,
		fontWeight: '600'
	}
});
export default ProfileImage;