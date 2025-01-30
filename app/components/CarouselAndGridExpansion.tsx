import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, StyleSheet } from 'react-native';

const mockGrids = [
  // Mock data for the carousel
  [
    ['X7', 'A2', 'L5', 'T9', 'P3'],
    ['D6', 'V1', 'Z4', 'C8', 'M2'],
    ['W5', 'Y9', 'F3', 'H6', 'B7'],
    ['J8', 'K4', 'S2', 'N1', 'E5'],
    ['G9', 'R7', 'Q6', 'U3', 'O8']
  ],
  [
    ['R3', 'Y6', 'P9', 'K2', 'X4'],
    ['F1', 'L7', 'B8', 'Z3', 'C5'],
    ['M2', 'O9', 'A4', 'D6', 'T1'],
    ['J7', 'E5', 'N8', 'Q3', 'W9'],
    ['S4', 'G2', 'V6', 'U1', 'H8']
  ],
  // Add more grids as needed
];

const CarouselAndGridExpansion = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handlePress = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index); // Toggle the expanded grid
  };

  const renderGrid = (grid: string[][]) => {
    return grid.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.gridRow}>
        {row.map((cell, cellIndex) => (
          <Text key={cellIndex} style={styles.gridCell}>{cell}</Text>
        ))}
      </View>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Horizontal Carousel */}
      <FlatList
        data={mockGrids}
        horizontal
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.carouselItem}
            onPress={() => handlePress(index)}
          >
            <Text style={styles.carouselText}>Grid {index + 1}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* Expandable Grids Section */}
      {expandedIndex !== null && (
        <ScrollView style={styles.expandedGridsContainer}>
          {renderGrid(mockGrids[expandedIndex])}
        </ScrollView>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  carouselItem: {
    marginHorizontal: 10,
    padding: 20,
    backgroundColor: '#007BFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselText: {
    color: '#fff',
    fontSize: 18,
  },
  expandedGridsContainer: {
    marginTop: 20,
    paddingBottom: 20,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  gridCell: {
    backgroundColor: '#F1F1F1',
    padding: 10,
    borderRadius: 5,
    fontSize: 14,
  },
});

export default CarouselAndGridExpansion;
