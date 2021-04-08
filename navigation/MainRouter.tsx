import * as React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import InboxScreen from '../screens/InboxScreen';
import SentScreen from '../screens/SentScreen';
import NewTaskScreen from '../screens/NewTaskScreen';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

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
        component={InboxNavigator}
        options={{
          tabBarIcon: ({ color }) => <FeatherIcon name="inbox" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Sent"
        component={SentNavigator}
        options={{
          tabBarIcon: ({ color }) => <FeatherIcon name="send" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="New Task"
        component={NewTaskNavigator}
        options={{
          tabBarIcon: ({ color }) => <FeatherIcon name="edit" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Contact"
        component={InboxScreen}
        options={{
          tabBarIcon: ({ color }) => <FeatherIcon name="user" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={InboxScreen}
        options={{
          tabBarIcon: ({ color }) => <FeatherIcon name="settings" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

const InboxStack = createNativeStackNavigator();

function InboxNavigator() {
  return (
    <InboxStack.Navigator>
      <InboxStack.Screen
        name="InboxScreen"
        component={InboxScreen}
        options={{
          title: 'For Me',
          headerStyle: {
            backgroundColor: '#2cb9af',
          },
          headerTintColor: '#fff',
          headerLargeTitle: true
        }}
      />
    </InboxStack.Navigator>
  );
}

const SentStack = createNativeStackNavigator();

function SentNavigator() {
  return (
    <SentStack.Navigator>
      <SentStack.Screen
        name="SentScreen"
        component={SentScreen}
        options={{
          title: 'Sent',
          headerStyle: {
            backgroundColor: '#2cb9af',
          },
          headerTintColor: '#fff',
          headerLargeTitle: true
        }}
      />
    </SentStack.Navigator>
  );
}

const NewTaskStack = createNativeStackNavigator();

function NewTaskNavigator() {
  return (
    <NewTaskStack.Navigator>
      <NewTaskStack.Screen
        name="NewTaskScreen"
        component={NewTaskScreen}
        options={{
          //TODO: change title
          title: 'New Task',
          headerStyle: {
            backgroundColor: '#2cb9af',
          },
          headerTintColor: '#fff',
          headerLargeTitle: true
        }}
      />
    </NewTaskStack.Navigator>
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
