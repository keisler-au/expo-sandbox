import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import IconHeader from "./IconHeader";


const MAIN_FONT_FAMILY = 'Verdana'

const gridOptions = ['5x5', '4x5', '4x4', '3x4', '3x3'];

const Publish = ({ route }) => {
  const navigation = useNavigation();
  const [selectedGridSize, setSelectedGridSize] = useState("5x5");
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);

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

  return (
    <View style={styles.screenContainer}>
      <IconHeader type={["home-outline"]} paths={["Home"]} />
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
      <TouchableOpacity
        onPress={() => (
          navigation.navigate("Play", {game: game.slice(0, rows).map(row => row.slice(0,cols))})
        )}
        activeOpacity={1}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Publish</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    position: "relative",
    height: "100%",
    backgroundColor: "#FAF9F6",
  },
  gridContainer: {
    position: "absolute",
    right: "5%",
    left: "5%",
    backgroundColor: "#FAF9F6",
    zIndex: 2,
  },
  gridText: {
    fontSize: 18,
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
