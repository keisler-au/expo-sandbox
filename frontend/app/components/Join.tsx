import React, { useState, useRef, useEffect } from 'react';
import {
  ActivityIndicator,
  View,
  TextInput,
  StyleSheet,
  Text,
  Pressable,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import CreateProfileModal from "./CreateProfileModal";
import FailedConnectionModal from './FailedConnectionModal';
import { getItemAsync } from 'expo-secure-store';
import { JOIN_GAME_URL, STORAGE_KEYS } from '../constants';
import Services from '../services';


const MAIN_FONT_FAMILY = 'Verdana';

const JoinGameInput = ({ joinGame }) => {
  const navigation = useNavigation();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [active, setActive] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);


  useEffect(() => {
    const enterPreviousGameCode = async () => {
      const previousGame = JSON.parse(await getItemAsync(STORAGE_KEYS.offlineGameState));
      if (previousGame && joinGame) {
        const currentTime = new Date();
        const lastUpdatedTime = new Date(previousGame.lastUpdated);
        const threeHours = 3 * (60 * 60 * 1000)
        if ((currentTime - lastUpdatedTime) < threeHours) {
          setCode(previousGame.code.split(""));
          // inputs.current[inputs.current.length-1]?.focus();
          setSubmit(true);
        }
      }
    }
    enterPreviousGameCode();
  }, [joinGame])

  const handleChange = (text: string, index: number) => {
    if (!/^[A-Z0-9]*$/.test(text)) return;
    if (text.length > 1 && text.length < 6) return;
    let nextFocus = text && index < 5 ? index + 1 : index;
    let newCode = [...code];
    newCode[index] = text;
    if (text.length === 6 && !index) {
      nextFocus = 5;
      newCode = text.split("");
    }
    inputs.current[nextFocus]?.focus()
    setCode(newCode);
    if (newCode.join('').length === 6) setSubmit(true);
  };

  const handleKeyPress = (e: any, index: number) => {
    const backSpaceCondition = e.nativeEvent.key === 'Backspace' && !code[index] && index > 0;
    backSpaceCondition && inputs.current[index - 1]?.focus();
  };

  const handleCollapse = () => {
    setActive(false);
    Keyboard.dismiss();
  };

  const connectToGame = async () => {
    if (loading) return;
    setLoading(true);
    const player = JSON.parse(await getItemAsync(STORAGE_KEYS.player));
    if (player) {
      const data = { code: code.join(""), player};
      const { response, error } = await Services.sendRequest(JOIN_GAME_URL, data);
      if (response && response.ok) {
        navigation.navigate("Play", { game: response.game, player })
      }
      setError(error) 
    }
    setModalVisible(!player);
    setLoading(false);
  }

  return (
    <Pressable style={containerStyles(active)} onPress={handleCollapse}>
      <Text style={styles.label}>Join</Text>
      <View style={styles.inputContainer}>
        {code.map((digit, index) => (
          index === 3 ?
          <View key={`container-${index}`} style={{flexDirection:"row", gap: 11}}>
            <Text key={`dash-${index}`} style={styles.dash}>
                -
            </Text>
            <TextInput
              key={`input-${index}`}
              ref={(el) => (inputs.current[index] = el)}
              style={styles.input}
              autoCapitalize="characters"
              maxLength={6}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => setActive(true)}
              selectionColor="black"
            />  
          </View>
            : <TextInput
              key={`input-${index}`}
              ref={(el) => (inputs.current[index] = el)}
              style={styles.input}
              autoCapitalize="characters"
              maxLength={6}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => setActive(true)}
              selectionColor="black"
            />
        ))}
      </View>
      {
        submit && 
        <TouchableOpacity
          onPress={connectToGame}
          activeOpacity={1}
          style={styles.button}
        >
          {loading ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text style={styles.buttonText}>Join Game</Text>
          )}
        </TouchableOpacity>
      }
      <CreateProfileModal displayModal={modalVisible} onClose={() => setModalVisible(false)} />
      <FailedConnectionModal displayModal={!!error} message={error} onClose={() => setError(false)} />
    </Pressable>
  );
};

const containerStyles = (active = false) =>
  StyleSheet.create({
    paddingTop: active ? 165 : 0,
    position: active ? 'absolute' : 'relative',
    top: active ? 50 : 120,
    bottom: 0,
    right: 0,
    left: 0,
    alignItems: 'center',
    zIndex: 100,
    backgroundColor: "#F0F0F0",
  });

const styles = StyleSheet.create({
  label: {
    fontWeight: 'bold',
    fontFamily: MAIN_FONT_FAMILY,
    fontSize: 18,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    width: 40,
    height: 50,
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 20,
    borderRadius: 5,
  },
  dash: {
    backgroundColor: "black",
    alignSelf: 'center',
    opacity: 0.5,
    height: 1,
    width: 6, 
  },
  button: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginTop: 35,
  },
  buttonText: {
    fontFamily: MAIN_FONT_FAMILY,
    fontSize: 23,
  },
});

export default JoinGameInput;
