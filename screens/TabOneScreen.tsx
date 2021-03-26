import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

export default function TabOneScreen() {
	return (
		<ScrollView contentContainerStyle={styles.container}>
			<View style={styles.container}>
				<Text style={styles.title}>Tab One Made By Chai</Text>
				<Text style={styles.title}>Tab One Made By Chai</Text>
			</View>
		</ScrollView  >
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontSize: 60,
		fontWeight: 'bold',
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%',
	},
});
