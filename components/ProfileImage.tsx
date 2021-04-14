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
				source={{uri: 'https://i.pinimg.com/originals/5d/70/18/5d70184dfe1869354afe7bf762416603.jpg'}}
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