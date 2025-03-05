import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { getItemAsync, setItemAsync } from 'expo-secure-store';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import Services from '../services';
import { CREATE_PLAYER_URL } from '../constants';
import FailedConnectionModal from './FailedConnectionModal';

const CreatePlayerModal = ({ displayModal, onClose }) => {
    const [name, setName] = useState();
    const [error, setError] = useState();

    useEffect(() => {
      const getName = async () => {
        const player = await getItemAsync("player");
        if (player) setName(JSON.parse(player).name);
      }
      
      if (!name) getName();
    }, [displayModal, name])

    const handleSubmit = async () => {
        const { 
          error, 
          response
        } = await Services.sendRequest(CREATE_PLAYER_URL, name)

        if (response && response.ok) {
          setName(response.player.name)
          setItemAsync("player", JSON.stringify(response.player))
          onClose()
        }
        setError(error)
    };

    return (
      <>
        <Modal
            transparent={true}
            visible={displayModal}
            // animationType="fade"
            onRequestClose={onClose}
        >
        <Pressable style={styles.modalContainer} onPress={onClose}>
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
        </Pressable>
        </Modal>
        <FailedConnectionModal displayModal={!!error} message={error} onClose={() => setError(false)} />
      </>
    );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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

export default CreatePlayerModal;
