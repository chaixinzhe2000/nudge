import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import * as firebase from 'firebase/app';
import firebaseConfig from './constants/ApiKey'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Register from './screens/auth/RegisterScreen';
import Landing from './screens/auth/LandingScreen';
import LoginScreen from './screens/auth/LoginScreen';
import { View, Text, Platform } from 'react-native';
import MainRouter from './navigation/MainRouter';

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
						<Stack.Screen name="Register" component={Register} options={{
							title: '',
          					headerStyle: {
            					backgroundColor: '#2cb9af',
          					},
          					headerTintColor: '#fff'
        				}} />
						<Stack.Screen name="Login" component={LoginScreen} options={{
							title: '',
          					headerStyle: {
            					backgroundColor: '#2cb9af',
          					},
          					headerTintColor: '#fff'
        				}} />

					</Stack.Navigator>
				</NavigationContainer>
				<StatusBar />
			</SafeAreaProvider>
		);
	}
	return (
		<SafeAreaProvider>
			<NavigationContainer>
				<Stack.Navigator initialRouteName="InboxScreen">
					<Stack.Screen name="MainRouter" component={MainRouter} options={{ headerShown: false }} />
				</Stack.Navigator>
			</NavigationContainer>
		</SafeAreaProvider>
	)
}
