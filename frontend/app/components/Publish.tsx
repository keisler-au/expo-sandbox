import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { getItemAsync } from "expo-secure-store";
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import IconHeader from "./IconHeader";

import CreateProfileModal from "./CreateProfileModal";
import FailedConnectionModal from './FailedConnectionModal';
import Services from '../services';
import { STORAGE_KEYS, PUBLISH_GAME_URL } from '../constants';


const MAIN_FONT_FAMILY = 'Verdana'

const gridOptions = ['5x5', '4x5', '4x4', '3x4', '3x3'];


const Publish = ({ route }) => {
  const navigation = useNavigation<any>();
  // const [player, setPlayer] = useState();
  const [selectedGridSize, setSelectedGridSize] = useState("5x5");
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [title, setTitle] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState<boolean | string>(false);

  const reformattedInitialGame = Array.from({ length: rows }, (_, rowIndex) =>
    route.params.game.slice(rowIndex * cols, (rowIndex + 1) * rows)
  );
  const [game, setGame] = useState(reformattedInitialGame)

    // useEffect(() => {
    //     console.log("Player: how many times is this rendering?")
    //     const getLocalPlayer = async () => {
    //         const localPlayer = await getItemAsync(STORAGE_KEYS.player);
    //         setPlayer(JSON.parse(localPlayer));
    //     }
    //     getLocalPlayer()
    // }, [])

  const selectGridSize = (item) => {
    setRows(item[0]);
    setCols(item.slice(-1));
    setSelectedGridSize(item)
  }
  const changeGridText = (input, row, col) => {
    let editedGame = [...game]
    editedGame[row][col] = input 
    setGame(editedGame)
  }
  const publishGame = async () => {
    const player = JSON.parse(await getItemAsync(STORAGE_KEYS.player));
    if (player) {
      const data = { 
        title, values: game.slice(0, rows).map(row => row.slice(0,cols)), player_id: player.id 
      };
      const { response, error } = await Services.sendRequest(PUBLISH_GAME_URL, data)
      if (response && response.ok) {
        navigation.navigate("Play", { game: response.game, player })
      }
      setError(error)
    }
    setModalVisible(!player)
  }

  return (
    <View style={styles.screenContainer}>
      <IconHeader type={["home-outline"]} paths={["Home"]} />
      {/* EditTitle */}
      <View style={styles.editTitleContainer}>
        <TextInput 
            placeholder='Game Name'
            style={styles.title} 
            value={title}
            onChangeText={(value) => setTitle(value)}
        />
        <Feather name="edit-3" size={20}/>
      </View>
      {/* EditGrid */}
      <View style={[styles.gridContainer, {bottom: rows === cols ? "35%" : "39%"}]}>
        {Array.from({length: rows}).map((_, rowIndex) => (
          <View key={rowIndex} style={styles.gridRow}>
            {Array.from({length: cols}).map((_, colIndex) => {
              return(
                <TextInput
                  key={colIndex + rowIndex}
                  multiline={true}
                  submitBehavior="blurAndSubmit"
                  style={[styles.gridText, {
                    height: rows === cols ? (350 / rows) : 280 / rows,
                    width: 350 / cols,
                  }]}
                  value={game[rowIndex][colIndex]}
                  onChangeText={(input) => changeGridText(input, rowIndex, colIndex)}
                />
              )
            })}
          </View>
        ))}
      </View>
      <View style={styles.pickerHelper} />
      <Picker
        selectedValue={selectedGridSize}
        onValueChange={selectGridSize}
        style={styles.picker}
      >
        {gridOptions.map((option) => (
          <Picker.Item key={option} label={option} value={option} />
        ))}
      </Picker>
      <TouchableOpacity onPress={publishGame} activeOpacity={1} style={styles.button}>
        <Text style={styles.buttonText}>
          Publish
        </Text>
      </TouchableOpacity>
      <CreateProfileModal displayModal={modalVisible} onClose={() => setModalVisible(false)} />
      <FailedConnectionModal displayModal={!!error} message={error} onClose={() => setError(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    position: "relative",
    alignItems: "center",
    height: "100%",
    backgroundColor: "#FAF9F6",
  },
  editTitleContainer: {
    marginTop: 88,
    width: "56%",
    height: 20,
    flexDirection: "row",
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderLeftColor: "transparent",
    borderBottomColor: "black",
    borderWidth: 1,
  },
  title: {
    width: 200,
    fontSize: 18,        
  },
  gridContainer: {
    borderWidth: 0.5,

    position: "absolute",
    right: "5%",
    left: "5%",
    backgroundColor: "#FAF9F6",
    zIndex: 2,
  },
  gridText: {
    borderWidth: 0.5,

    fontSize: 15,
    textAlign: "center",
    fontWeight: 'bold',
    // borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
  },
  pickerHelper: {
    height: 50,
    position: "absolute",
    bottom: "32%",
    left: "35%",
    right: "35%",
    backgroundColor: "#FAF9F6",
    zIndex: 1,
  },
  picker: {
    position: "absolute",
    bottom: "17%",
    left: "35%",
    right: "35%",
    height: 165,
    marginVertical: 0,
    overflow: "hidden",
    backgroundColor: "#FAF9F6",
  },
  gridRow: {
    flexDirection: "row",
  },
  button: {
    position: "absolute",
    bottom: "7%",
    left: "20%",
    right: "20%",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8,
    padding: 8,
    opacity: 0.5,
  },
  buttonText: {
    textAlign: "center",
    color: "black",
    fontFamily: MAIN_FONT_FAMILY,
    fontSize: 23,
  },
});


export default Publish;
