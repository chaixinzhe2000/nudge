import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import * as firebase from 'firebase';
import firebaseConfig from './constants/ApiKey'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Register from './screens/auth/RegisterScreen';
import Landing from './screens/auth/LandingScreen';
import LoginScreen from './screens/auth/LoginScreen';
import { View, Text } from 'react-native';

export default function App() {
	// for native-screen package
	enableScreens();
	const Stack = createStackNavigator();
	const [loaded, setLoaded]: [boolean, any] = useState(false);
	const [loggedIn, setLoggedIn]: [boolean, any] = useState(false);

	useEffect(() => {
		firebase.auth().onAuthStateChanged((user) => {
			if (!user) {
				setLoggedIn(false);
				setLoaded(true);
			} else {
				setLoggedIn(true);
				setLoaded(true);
			}
		})
	}, []);

	if (!firebase.apps.length) {
		firebase.initializeApp(firebaseConfig);
	} else {
		firebase.app(); // if already initialized, use that one
	}

	if (!loaded) {
		return (
			<View style={{ flex: 1, justifyContent: 'center' }}>
				<Text>Loading</Text>
			</View>
		)
	} 
	if (!loggedIn) {
		return (
			<SafeAreaProvider>
				<NavigationContainer>
					<Stack.Navigator initialRouteName="Landing">
						<Stack.Screen name="Landing" component={Landing} options={{ headerShown: false }} />
						<Stack.Screen name="Register" component={Register} />
						<Stack.Screen name="Login" component={LoginScreen} />

					</Stack.Navigator>
				</NavigationContainer>
				<StatusBar />
			</SafeAreaProvider>
		);
	}

	return (
		<View style={{ flex: 1, justifyContent: 'center' }}>
			<Text>User is Logged in</Text>
		</View>
	)
}
