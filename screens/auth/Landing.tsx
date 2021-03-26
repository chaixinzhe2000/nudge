import React from "react";
import { View, Text, Button } from "react-native";

interface ILandingProps {
	navigation: any
}
function Landing(props: ILandingProps) {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Button title="Register" onPress={() => props.navigation.navigate("Register")} />
			<Button title="Login" onPress={() => props.navigation.navigate("Login")} />
		</View>
	);
}

export default Landing;