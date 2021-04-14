import React from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons';

function FeatherIcon(props: { name: React.ComponentProps<typeof Feather>['name']; color: string }) {
	return <Feather size={24} style={{ marginBottom: -3 }} {...props} />;
}

interface ILandingProps {
	navigation: any
}

function Landing(props: ILandingProps) {
	return (
		<View style={styles.container}>
			<Text style={styles.welcome}>Welcome to</Text>
			<Text style={styles.nudge}>Nudge</Text>
			<TouchableOpacity onPress={() => props.navigation.navigate("Register")} >
				<View style={styles.buttonDiv}>
					<Text style={styles.text}>REGISTER</Text>
					<FeatherIcon name="arrow-right" color='#2cb9b0' />
				</View>
          	</TouchableOpacity>
			<TouchableOpacity onPress={() => props.navigation.navigate("Login")} >
				<View style={styles.buttonDiv}>
					<Text style={styles.text}>LOGIN</Text>
					<FeatherIcon name="arrow-right" color='#2cb9b0' />
				</View>
          	</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#2cb9b0',
		paddingTop: 90,
		paddingLeft: 30,
		paddingRight: 30
	},
	welcome: {
		fontSize: 40,
		fontWeight: '500',
		color: 'white'
	},
	nudge: {
		fontSize: 40,
		fontWeight: '700',
		color: 'white',
		marginBottom: 45
	},
	buttonDiv: {
		backgroundColor: 'white',
		minHeight: 50,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		borderRadius: 10,
		marginBottom: 12,
		paddingRight: 10
	},
	text: {
		marginLeft: 15,
		color: '#2cb9b0',
		fontSize: 18,
		fontWeight: '700'
	}
});

export default Landing;