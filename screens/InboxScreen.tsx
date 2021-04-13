import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import AddContactModal from '../components/AddContactModal';
import IndividualTaskList from '../components/IndividualTaskList';
import ProfileImage from '../components/ProfileImage';
import { Text, View } from '../components/Themed';

export default function InboxScreen(props) {
  return (
    <>
    <ScrollView style={{ backgroundColor: 'white' }}>
      <AddContactModal setAddContactModalOpen={props.setAddContactModalOpen} addContactModalOpen={props.addContactModalOpen} />
      <Text style={styles.favorites}>Favorites</Text>
      <ScrollView horizontal={true}
        contentContainerStyle={styles.favoritesContainer}
        showsHorizontalScrollIndicator={false}
      >
      
        <ProfileImage />
        <ProfileImage />
        <ProfileImage />
        <ProfileImage />
        <ProfileImage />
        <ProfileImage />
        <ProfileImage />
        <ProfileImage />
        <ProfileImage />
        <ProfileImage />
        <ProfileImage />
      </ScrollView>
      <View style={styles.scrollContainer}>
        <IndividualTaskList />
        <IndividualTaskList />
        <IndividualTaskList />
        <IndividualTaskList />
        <IndividualTaskList />
        <IndividualTaskList />
        <IndividualTaskList />
        <IndividualTaskList />
      </View>
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  favorites: {
    paddingTop: 10,
    backgroundColor: 'white',
    fontSize: 17,
    fontWeight: '500',
    paddingLeft: 15,
  },
  favoritesContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 100,
    paddingTop: 10,
    paddingLeft: 12,
    marginBottom: 20
  },
  scrollContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    backgroundColor: 'white',
    height: '100%',
    width: '100%',

  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
