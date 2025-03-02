import React, { memo } from 'react';
import { View, StyleSheet, Text, FlatList, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
// TODO
const GRID_SIZE_1 = width / 1.35;
export const GRID_SIZE = 250;
const screenWidth = Dimensions.get('window').width;
const MAIN_SQUARE_COLOR = 'rgb(50, 50, 50)';
const SCREEN_TEXT_COLOR = 'rgb(212, 175, 55)';



export const gridStyles = (raiseSquare = null, rows = 5, columns = 5) =>
  StyleSheet.create({
    gridContainer: {
      flexWrap: 'wrap',
      height: GRID_SIZE_1 + 7,
      width: GRID_SIZE_1 + 7,
      borderWidth: 3,
      borderRadius: 5,
      borderColor: 'black',
      backgroundColor: 'black',
    },
    square: {
      height: GRID_SIZE_1 / rows,
      width: GRID_SIZE_1 / columns,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 2,

      backgroundColor: MAIN_SQUARE_COLOR,
    },
    text: {
      color: 'rgb(255, 224, 160)',
    },
  });

export default {}