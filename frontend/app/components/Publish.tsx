import React, { useState } from 'react';
import { ActivityIndicator, View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { getItemAsync } from "expo-secure-store";
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import IconHeader from "./IconHeader";

import CreateProfileModal from "./CreateProfileModal";
import FailedConnectionModal from './FailedConnectionModal';
import Services from '../services';
import { STORAGE_KEYS, PUBLISH_GAME_URL } from '../constants';
import EditableGrid from './EditableGrid';


const MAIN_FONT_FAMILY = 'Verdana'

const GRID_OPTIONS = ['5x5', '4x5', '4x4', '3x4', '3x3'];


const Publish = ({ route }) => {
  const navigation = useNavigation<any>();
  const [selectedGridSize, setSelectedGridSize] = useState("5x5");
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [title, setTitle] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

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

  // TODO: TESTING
  // 1. Unit test
  // 2. If it's not working it's not working, the errors should work
  const publishGame = async () => {
    if (loading) return;
    setLoading(true);
    const player = JSON.parse(await getItemAsync(STORAGE_KEYS.player));
    if (player) {
      const values = game.slice(0, rows).map(row => row.slice(0,cols));
      const data = { title, values, player_id: player.id };
      const { response, error } = await Services.sendRequest(PUBLISH_GAME_URL, data)
      if (response && response.ok) navigation.navigate("Play", { game: response.game, player })
      setError(error);
    }
    setModalVisible(!player);
    setLoading(false);
  }

  return (
    <View style={styles.screenContainer}>
      <IconHeader type={["home-outline"]} paths={["Home"]} />
      {/* EditTitle */}
      <View style={styles.editTitleContainer}>
        <TextInput 
            placeholder='Enter Game Name'
            style={styles.title} 
            value={title}
            onChangeText={(value) => setTitle(value)}
        />
        <Feather name="edit-3" size={20}/>
      </View>
      <EditableGrid game={game} rows={rows} cols={cols} onChange={changeGridText} />
      <View style={styles.pickerHelper} />
      <Picker
        selectedValue={selectedGridSize}
        onValueChange={selectGridSize}
        style={styles.picker}
      >
        {GRID_OPTIONS.map((option) => <Picker.Item key={option} label={option} value={option} /> )}
      </Picker>
      <TouchableOpacity onPress={publishGame} activeOpacity={1} style={styles.button}>
        { loading 
          ? <ActivityIndicator size="small" /> 
          : <Text style={styles.buttonText}>Publish</Text> }
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
