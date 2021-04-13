import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Modal, View, Text, StyleSheet } from "react-native";

interface IAddContactModalProps {
  addContactModalOpen: boolean,
  setAddContactModalOpen: any,
}

export default function AddContactModal(props: IAddContactModalProps) {

  return (
    <Modal visible={props.addContactModalOpen} animationType='slide'>
      <View style={styles.modalContent}>
        <MaterialIcons
          name='close'
          size={24}
          onPress={()=> props.setAddContactModalOpen(false)}
          style={styles.closeButton}
          />

        <Text> Hello from the modal :)</Text>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
  },
  closeButton: {
    marginTop:599
  }
})

