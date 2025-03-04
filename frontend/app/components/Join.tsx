import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Pressable,
  Button,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import CreateProfileModal from "./CreateProfileModal";
import FailedConnectionModal from './FailedConnectionModal';
import { getItemAsync } from 'expo-secure-store';


const SCREEN_BACKGROUND_COLOR = 'rgb(27, 33, 36)';
const SCREEN_TEXT_COLOR = 'rgb(212, 175, 55)';
const CODE_BOX_OUTLINE_COLOR = 'rgba(212, 175, 55, 0.5)';
const MAIN_FONT_FAMILY = 'Verdana';

const VerificationCodeInput = ({ joinGame }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [active, setActive] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(false);
  const inputs = useRef<Array<TextInput | null>>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const enterPreviousGameCode = async () => {
      const previousGame = await getItemAsync("offlineGameState");
      if (previousGame && joinGame) {
        // if (previousGame.last_updated < 3 hours ago) {
        //   setCode(previousGame.code.split(""));
        //   // hopefully this automatically brings up the keyboard and pushed the join game input into view
        //   inputs.current[-1]?.focus();
        // }

      }
    }
    enterPreviousGameCode();
  }, [joinGame])

  const handleChange = (text: string, index: number) => {
    if (!/^\d?$/.test(text)) return;
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    const strCode = newCode.join('');
    if (strCode.length === 6) {
      handleSubmit(strCode);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (enteredCode: string) => {
    setSubmit(true)
  };

  const handleCollapse = () => {
    setActive(false);
    Keyboard.dismiss();
  };

  const connectToGame = () => {
    let displayProfileModal = true;
    // check player
    // check error
    // check last updated and push to database
    // check response 
      // -> if failed then check if offlineGameStatus.code matches code
      // -> if it does match, then pass the offline game into the route
    // if (localStorage.getItem("player")) {
    //   navigation.navigate("Play" {game: response.game || });
    //   displayProfileModal = false;
    // }
    // setModalVisible(displayProfileModal);
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
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => setActive(true)}
              selectionColor={CODE_BOX_OUTLINE_COLOR}
            />  
          </View>
            : <TextInput
              key={`input-${index}`}
              ref={(el) => (inputs.current[index] = el)}
              style={styles.input}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => setActive(true)}
              selectionColor={CODE_BOX_OUTLINE_COLOR}
            />
        ))}
      </View>
      {
        submit && <TouchableOpacity
        onPress={connectToGame}
        activeOpacity={1}
        style={styles.button}
        ><Text style={styles.buttonText}>Join Game</Text>
        </TouchableOpacity>
      }
      <CreateProfileModal displayModal={modalVisible} onClose={() => setModalVisible(false)} />
      <FailedConnectionModal displayModal={!!error} message={error} onClose={() => setError(false)} />
    </Pressable>
  );
};

const containerStyles = (active = false) =>
  StyleSheet.create({
    position: active ? 'absolute' : 'relative',
    paddingTop: active ? 265 : 0,
    top: active ? 0 : 200,
    bottom: 0,
    right: 0,
    left: 0,
    alignItems: 'center',
    backgroundColor: SCREEN_BACKGROUND_COLOR,
    zIndex: 100,
  });

const styles = StyleSheet.create({
  label: {
    color: SCREEN_TEXT_COLOR,
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
    borderColor: CODE_BOX_OUTLINE_COLOR,
    // opacity: 0.5,
    textAlign: 'center',
    fontSize: 20,
    borderRadius: 5,
    color: SCREEN_TEXT_COLOR,
  },
  dash: {
    backgroundColor: SCREEN_TEXT_COLOR,
    alignSelf: 'center',
    opacity: 0.5,
    height: 1,
    width: 6, 
  },
  button: {
    borderWidth: 1,
    borderColor: SCREEN_TEXT_COLOR,
    borderRadius: 8,
    padding: 8,
    marginTop: 50,
    opacity: 0.5,
  },
  buttonText: {
    color: SCREEN_TEXT_COLOR,
    fontFamily: MAIN_FONT_FAMILY,
    fontSize: 23,
  },
});

export default VerificationCodeInput;
