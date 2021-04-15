import * as React from 'react';
import { Button, StyleSheet, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import InboxScreen from '../screens/InboxScreen';
import SentScreen from '../screens/SentScreen';
import NewTaskScreen from '../screens/NewTaskScreen';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import SettingsScreen from '../screens/SettingsScreen';
import { useState } from 'react';
import ContactsScreen from '../screens/ContactsScreen';

const BottomTab = createBottomTabNavigator();

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function FeatherIcon(props: { name: React.ComponentProps<typeof Feather>['name']; color: string }) {
  return <Feather size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function MainRouter() {
  const [addContactModalOpen, setAddContactModalOpen] = useState(false);
  return (
    <BottomTab.Navigator
      initialRouteName="Inbox"
      tabBarOptions={{
        activeTintColor: '#2cb9af'
      }}>
      <BottomTab.Screen
        name="Inbox"
        children = {() => <InboxNavigator addContactModalOpen={addContactModalOpen} setAddContactModalOpen={setAddContactModalOpen}/>}
        options={{
          tabBarIcon: ({ color }) => <FeatherIcon name="inbox" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Sent"
        children = {() => <SentNavigator addContactModalOpen={addContactModalOpen} setAddContactModalOpen={setAddContactModalOpen}/>}
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
        name="Contacts"
        children = {() => <ContactsNavigator addContactModalOpen={addContactModalOpen} setAddContactModalOpen={setAddContactModalOpen}/>}
        options={{
          tabBarIcon: ({ color }) => <FeatherIcon name="user" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{
          tabBarIcon: ({ color }) => <FeatherIcon name="settings" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

const InboxStack = createNativeStackNavigator();

function InboxNavigator(props) {
  return (
    <InboxStack.Navigator>
      <InboxStack.Screen
        name="InboxScreen"
        children={() => <InboxScreen setAddContactModalOpen={props.setAddContactModalOpen} addContactModalOpen={props.addContactModalOpen} />}
        options={{
          title: 'For Me',
          headerStyle: {
            backgroundColor: '#2cb9af',
          },
          headerTintColor: '#fff',
          headerLargeTitle: true,
          headerRight: () => (
            <TouchableOpacity onPress={() => props.setAddContactModalOpen(true)} >
              <FeatherIcon name="user-plus" color='white'/>
            </TouchableOpacity>
          )
        }}
      />
    </InboxStack.Navigator>
  );
}

const SentStack = createNativeStackNavigator();

function SentNavigator(props) {
  return (
    <SentStack.Navigator>
      <SentStack.Screen
        name="SentScreen"
        children={() => <SentScreen setAddContactModalOpen={props.setAddContactModalOpen} addContactModalOpen={props.addContactModalOpen} />}
        options={{
          title: 'Sent',
          headerStyle: {
            backgroundColor: '#2cb9af',
          },
          headerTintColor: '#fff',
          headerLargeTitle: true,
          headerRight: () => (
            <TouchableOpacity onPress={() => props.setAddContactModalOpen(true)} >
              <FeatherIcon name="user-plus" color='white'/>
            </TouchableOpacity>
          )
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


const SettingsStack = createNativeStackNavigator();

function SettingsNavigator() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          headerStyle: {
            backgroundColor: '#2cb9af',
          },
          headerTintColor: '#fff',
          headerLargeTitle: true
        }}
      />
    </SettingsStack.Navigator>
  );
}


const ContactsStack = createNativeStackNavigator();

function ContactsNavigator(props) {
  return (
    <ContactsStack.Navigator>
      <ContactsStack.Screen
        name="ContactsScreen"
        children={() => <ContactsScreen setAddContactModalOpen={props.setAddContactModalOpen} addContactModalOpen={props.addContactModalOpen} />}
        options={{
          title: 'Contacts',
          headerStyle: {
            backgroundColor: '#2cb9af',
          },
          headerTintColor: '#fff',
          headerLargeTitle: true,
          headerRight: () => (
            <TouchableOpacity onPress={() => props.setAddContactModalOpen(true)} >
              <FeatherIcon name="user-plus" color='white'/>
            </TouchableOpacity>
          )
        }}
      />
    </ContactsStack.Navigator>
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
