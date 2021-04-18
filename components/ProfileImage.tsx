import React from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ProfileImage = (props) => {
	const name = props.name;
	const firstName = name.substr(0, name.indexOf(' '));
	const lastName = name.substr(name.indexOf(' ') + 1);

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				marginRight: 15
			}}>
			<TouchableOpacity onPress={() => {
				props.setSelectedContact({
					uid: props.uid,
					displayName: props.name,
					email: props.email,
					avatar: props.profileImg
				}); props.setAddViewContactsTasksModalOpen(true)
			}}>
				<View style={{
					borderRadius: 90, padding: 2, backgroundColor: 'white',
					borderWidth: 2, borderColor: '#2cb890'
				}}>
					<Image
						style={styles.stretch}
						source={{ uri: props.profileImg ? props.profileImg : 'https://i.pinimg.com/originals/5d/70/18/5d70184dfe1869354afe7bf762416603.jpg' }}
					/>
				</View>
			</TouchableOpacity>
			<Text style={styles.firstName}>{firstName}</Text>
			<Text style={styles.lastName}>{lastName}</Text>


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
	firstName: {
		paddingTop: 5,
		fontWeight: '500'
	},
	lastName: {
		fontWeight: '500'
	}
});
export default ProfileImage;