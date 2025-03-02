import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { setItemAsync } from 'expo-secure-store';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const NameModal = ({ displayModal, onClose }) => {
    const navigation = useNavigation()
    const [name, setName] = useState('');

    const handleSubmit = () => {
        setItemAsync("player", JSON.stringify(name))
        onClose()
        // navigation.navigate("Publish")
    };

    return (
        <Modal
            transparent={true}
            visible={displayModal}
            // animationType="fade"
            onRequestClose={onClose}
        >
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
            <Text style={styles.title}>Player Name:</Text>
            <TextInput
                style={styles.input}
                placeholder="Player name"
                value={name}
                onChangeText={setName}
            />
            <TouchableOpacity 
              style={[styles.submitButton, {opacity: name === "" ? .5 : 1}]} 
              disabled={name == ""} 
              onPress={handleSubmit}
            >
                <Text style={styles.buttonText}>Enter</Text>
            </TouchableOpacity>
            </View>
        </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Darkened background
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default NameModal;
