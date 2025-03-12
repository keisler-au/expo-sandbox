import React, { useState, useRef, useEffect } from "react";
import {
  ActivityIndicator,
  View,
  TextInput,
  StyleSheet,
  Text,
  Pressable,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useNetInfo } from "@react-native-community/netinfo";
import CreateProfileModal from "./CreateProfileModal";
import FailedConnectionModal from "./FailedConnectionModal";
import { getItemAsync } from "expo-secure-store";
import { JOIN_GAME_URL, STORAGE_KEYS } from "../constants";
import Services from "../services";
import { Game, RootStackParamList } from "../types";

const MAIN_FONT_FAMILY = "Verdana";

const JoinGameInput = ({ joinGameVisible }: { joinGameVisible: boolean }) => {
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, "Play">>();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [active, setActive] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [previousGame, setPreviousGame] = useState<Game | false>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState<string | boolean>(false);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);
  const netInfo = useNetInfo();
  const isOffline = !netInfo.isConnected;

  useEffect(() => {
    const enterPreviousGameCode = async () => {
      // TODO: TESTING
      const storedGame = await getItemAsync(STORAGE_KEYS.offlineGameState);
      const loadedGame: Game | false = storedGame && JSON.parse(storedGame);
      if (loadedGame && loadedGame.lastSaved && joinGameVisible) {
        const threeHours = 3 * (60 * 60 * 1000);
        if (
          new Date().getTime() - new Date(loadedGame.lastSaved).getTime() <
          threeHours
        ) {
          setCode(loadedGame.code.split(""));
          setSubmit(true);
        }
        setPreviousGame(loadedGame);
      }
    };
    enterPreviousGameCode();
  }, []);

  // TODO: TESTING
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
    inputs.current[nextFocus]?.focus();
    setCode(newCode);
    if (newCode.join("").length === 6) setSubmit(true);
  };

  const handleKeyPress = (e: any, index: number) => {
    const backSpaceCondition =
      e.nativeEvent.key === "Backspace" && !code[index] && index > 0;
    backSpaceCondition && inputs.current[index - 1]?.focus();
  };

  const handleCollapse = () => {
    setActive(false);
    Keyboard.dismiss();
  };
  // TODO: if player is offline then use saved game
  // TODO: TESTING
  // 1. Unit test
  // 2. If it fails it will clearly be isolate to this function
  const connectToGame = async () => {
    if (loading) return;
    setLoading(true);
    const storedPlayer = await getItemAsync(STORAGE_KEYS.player);
    const player = storedPlayer && JSON.parse(storedPlayer);
    if (player && previousGame && isOffline)
      navigation.navigate("Play", { game: previousGame, player });
    else if (player) {
      const data = { code: code.join(""), player };
      const { response, error } = await Services.sendRequest(
        JOIN_GAME_URL,
        data,
      );
      if (response && response.ok) {
        // saveGameToStorage(response.game)
        navigation.navigate("Play", { game: response.game, player });
      }
      setError(error);
    }
    setModalVisible(!player);
    setLoading(false);
  };

  return (
    <Pressable
      style={containerStyles(active).container}
      onPress={handleCollapse}
    >
      <Text style={styles.label}>Join</Text>
      <View style={styles.inputContainer}>
        {code.map((digit, index) => (
          <View
            key={`container-${index}`}
            style={{ flexDirection: "row", gap: 11 }}
          >
            {index === 3 && (
              <Text key={`dash-${index}`} style={styles.dash}>
                {" "}
                -{" "}
              </Text>
            )}
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
        ))}
      </View>
      {submit && (
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
      )}
      <CreateProfileModal
        displayModal={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      <FailedConnectionModal
        displayModal={!!error}
        message={error}
        onClose={() => setError(false)}
      />
    </Pressable>
  );
};

const containerStyles = (active = false) =>
  StyleSheet.create({
    container: {
      paddingTop: active ? 165 : 0,
      position: active ? "absolute" : "relative",
      top: active ? 50 : 120,
      bottom: 0,
      right: 0,
      left: 0,
      alignItems: "center",
      zIndex: 100,
      backgroundColor: "#F0F0F0",
    },
  });

const styles = StyleSheet.create({
  label: {
    fontWeight: "bold",
    fontFamily: MAIN_FONT_FAMILY,
    fontSize: 18,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    gap: 10,
  },
  input: {
    width: 40,
    height: 50,
    borderWidth: 1,
    textAlign: "center",
    fontSize: 20,
    borderRadius: 5,
  },
  dash: {
    height: 1,
    width: 6,
    backgroundColor: "black",
    alignSelf: "center",
    opacity: 0.5,
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
