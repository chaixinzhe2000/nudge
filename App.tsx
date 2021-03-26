import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import * as firebase from 'firebase';
import firebaseConfig from './constants/ApiKey'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Register from './screens/auth/Register';
import Landing from './screens/auth/Landing';

export default function App() {
	const isLoadingComplete = useCachedResources();
	const colorScheme = useColorScheme();

	// for native-screen package
	enableScreens();
	const Stack = createStackNavigator();

	if (!firebase.apps.length) {
		firebase.initializeApp(firebaseConfig);
	} else {
		firebase.app(); // if already initialized, use that one
	}

	if (!isLoadingComplete) {
		return null;
	} else {
		return (
			<SafeAreaProvider>
				<NavigationContainer>
					<Stack.Navigator initialRouteName="Landing">
						<Stack.Screen name="Landing" component={Landing} options={{headerShown: false}}/>
						<Stack.Screen name="Register" component={Register}/>

					</Stack.Navigator>
				</NavigationContainer>
				<StatusBar />
			</SafeAreaProvider>
		);
	}
}
