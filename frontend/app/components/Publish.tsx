import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { getItemAsync } from "expo-secure-store";
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import IconHeader from "./IconHeader";

import CreateProfileModal from "./CreateProfileModal";
import FailedConnectionModal from './FailedConnectionModal';
import Services from '../services';
import { PUBLISH_GAME_URL } from '../constants';


const MAIN_FONT_FAMILY = 'Verdana'

const gridOptions = ['5x5', '4x5', '4x4', '3x4', '3x3'];


const Publish = ({ route }) => {
  const navigation = useNavigation<any>();
  const [selectedGridSize, setSelectedGridSize] = useState("5x5");
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [title, setTitle] = useState("GameA1B2C3");
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState<boolean | string>(false);

  const reformattedInitialGame = Array.from({ length: rows }, (_, rowIndex) =>
    route.params.game.slice(rowIndex * cols, (rowIndex + 1) * rows)
  );
  const [game, setGame] = useState(reformattedInitialGame)

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
    const publicGame = {
      title: title,
      values: game.slice(0, rows).map(row => row.slice(0,cols))
    };

    const { 
      displayProfileModal, 
      error, 
      response
    } = await Services.publishedGame(PUBLISH_GAME_URL, publicGame)

    if (response && response.ok) {
      navigation.navigate("Play", { game: response.game })
    }

    setModalVisible(displayProfileModal)
    setError(error)
  }

  return (
    <View style={styles.screenContainer}>
      <IconHeader type={["home-outline"]} paths={["Home"]} />
      {/* EditTitle */}
      <View style={styles.titleContainer}>
        <TextInput 
            style={styles.title} 
            value={title}
            onChangeText={(value) => setTitle(value)}
        />
        <Feather name="edit-3" size={20}/>
      </View>
      {/* EditGrid */}
      <View style={[styles.gridContainer, {bottom: rows === cols ? "40%" : "45%"}]}>
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
    height: "100%",
    backgroundColor: "#FAF9F6",
  },
  titleContainer: {
    marginTop: 60,
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
    position: "absolute",
    right: "5%",
    left: "5%",
    backgroundColor: "#FAF9F6",
    zIndex: 2,
  },
  gridText: {
    fontSize: 15,
    textAlign: "center",
    fontWeight: 'bold',
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
  },
  pickerHelper: {
    height: 50,
    position: "absolute",
    bottom: "37%",
    left: "35%",
    right: "35%",
    backgroundColor: "#FAF9F6",
    zIndex: 1,
  },
  picker: {
    position: "absolute",
    left: "35%",
    right: "35%",
    bottom: "22%",
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
