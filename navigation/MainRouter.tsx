import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { Text, View } from '../components/Themed';
import TabTwoScreen from '../screens/MainScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import * as ImagePicker from 'expo-image-picker';

const BottomTab = createBottomTabNavigator();

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function FeatherIcon(props: { name: React.ComponentProps<typeof Feather>['name']; color: string }) {
	return <Feather size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabOneScreen() {
	return (
		<BottomTab.Navigator
			initialRouteName="Inbox"
			tabBarOptions={{
				activeTintColor: '#2cb9af'
			}}>
			<BottomTab.Screen
				name="Inbox"
				component={TabOneNavigator}
				options={{
					tabBarIcon: ({ color }) => <FeatherIcon name="inbox" color={color} />,
				}}
			/>
			<BottomTab.Screen
				name="Sent"
				component={TabTwoScreen}
				options={{
					tabBarIcon: ({ color }) => <FeatherIcon name="send" color={color} />,
				}}
			/>
			<BottomTab.Screen
				name="Post"
				component={TabTwoScreen}
				options={{
					tabBarIcon: ({ color }) => <FeatherIcon name="edit" color={color} />,
				}}
			/>
			<BottomTab.Screen
				name="Contact"
				component={TabTwoScreen}
				options={{
					tabBarIcon: ({ color }) => <FeatherIcon name="user" color={color} />,
				}}
			/>
			<BottomTab.Screen
				name="Settings"
				component={TabTwoScreen}
				options={{
					tabBarIcon: ({ color }) => <FeatherIcon name="settings" color={color} />,
				}}
			/>
		</BottomTab.Navigator>
	);
}

const Stack = createNativeStackNavigator();

function TabOneNavigator() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="TabOneScreen"
				component={TabTwoScreen}
				options={{
					title: 'For Me',
					headerStyle: {
						backgroundColor: '#2cb9af',
					},
					headerTintColor: '#fff',
					headerLargeTitle: true
				}}
			/>
		</Stack.Navigator>
	);
}

const TabTwoStack = createStackNavigator();

function TabTwoNavigator() {
	return (
		<TabTwoStack.Navigator>
			<TabTwoStack.Screen
				name="TabTwoScreen"
				component={TabTwoScreen}
				options={{ headerTitle: 'Tab Two Title' }}
			/>
		</TabTwoStack.Navigator>
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
