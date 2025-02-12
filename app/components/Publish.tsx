import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import bingoGames from '../templateFixtures';

const gridOptions = [
  { label: '5x5', value: [5, 5] },
  { label: '4x5', value: [4, 5] },
  { label: '4x4', value: [4, 4] },
  { label: '3x4', value: [3, 4] },
  { label: '3x3', value: [3, 3] },
];

const Publish = ({ route }) => {
  const [selectedGrid, setSelectedGrid] = useState([5, 5]);
  const [rows, cols] = selectedGrid;

  const game = bingoGames[route.params.gameIndex].slice(0, rows)

//   // Generate the grid data
//   const gridData = Array.from({ length: rows * cols }, (_, index) => index + 1);

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedGrid}
        onValueChange={(itemValue) => setSelectedGrid(itemValue)}
        style={styles.picker}
      >
        {gridOptions.map((option) => (
          <Picker.Item key={option.label} label={option.label} value={option.value} />
        ))}
      </Picker>

      <View style={styles.gridContainer}>
        <FlatList
          data={game}
          numColumns={cols}
          key={cols} // Important: Forces re-render on column change
          renderItem={({ item }) => (
            <View style={styles.gridItem}>
              <Text style={styles.gridText}>{item}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  picker: {
    width: 150,
    height: 50,
  },
  gridContainer: {
    marginTop: 20,
  },
  gridItem: {
    width: 50, // Adjust as needed
    height: 50, // Adjust as needed
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  gridText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Publish;
