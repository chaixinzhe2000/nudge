import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Feather } from '@expo/vector-icons';
import TabOneScreen from '../screens/TabOneScreen';
import TabTwoScreen from '../screens/TabTwoScreen';
import { BottomTabParamList, TabOneParamList, TabTwoParamList } from '../types';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {

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
				component={TabTwoNavigator}
				options={{
					tabBarIcon: ({ color }) => <FeatherIcon name="send" color={color} />,
				}}
			/>
			<BottomTab.Screen
				name="Post"
				component={TabTwoNavigator}
				options={{
					tabBarIcon: ({ color }) => <FeatherIcon name="edit" color={color} />,
				}}
			/>
			<BottomTab.Screen
				name="Contact"
				component={TabTwoNavigator}
				options={{
					tabBarIcon: ({ color }) => <FeatherIcon name="user" color={color} />,
				}}
			/>
			<BottomTab.Screen
				name="Settings"
				component={TabTwoNavigator}
				options={{
					tabBarIcon: ({ color }) => <FeatherIcon name="settings" color={color} />,
				}}
			/>
		</BottomTab.Navigator>
	);
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function FeatherIcon(props: { name: React.ComponentProps<typeof Feather>['name']; color: string }) {
	return <Feather size={24} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const Stack = createNativeStackNavigator();

function TabOneNavigator() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="TabOneScreen"
				component={TabOneScreen}
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

const TabTwoStack = createStackNavigator<TabTwoParamList>();

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
