import React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';

const ProfileImage = () => {
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				marginRight: 15
			}}>
			<View style={{borderRadius: 90, padding: 2, backgroundColor: 'white',
					borderWidth: 2, borderColor: '#2cb890'}}>
			<Image
				style={styles.stretch}
				source={{uri: 'https://st2.depositphotos.com/1009634/7235/v/600/depositphotos_72350117-stock-illustration-no-user-profile-picture-hand.jpg'}}
			/>
			</View>
			<Text style={styles.name}>Xinzhe</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 50,
	},
	stretch: {
		width: 52,
		height: 52,
		paddingRight: 20,
		borderRadius: 90
	},
	name: {
		paddingTop: 5,
		fontWeight: '500'
	}
});
export default ProfileImage;