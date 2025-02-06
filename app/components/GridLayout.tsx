import React, { memo } from 'react';
import { View, StyleSheet, Text, FlatList, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const GRID_SIZE_1 = width / 1.35;
export const GRID_SIZE = 250;
const screenWidth = Dimensions.get('window').width;
const MAIN_SQUARE_COLOR = 'rgb(50, 50, 50)';
const SCREEN_TEXT_COLOR = 'rgb(212, 175, 55)';

const Grid = memo(({ gridData, gridType, onSquarePress }) => {
  return (
    <View style={[styles().gridContainer]}>
      {gridData.map((item, index) => (
        <View key={index} style={[styles().square]}>
          <Text>{item}</Text>
        </View>
      ))}
    </View>
  );
});

export const gridStyles = (raiseSquare = null, rows = 5, columns = 5) =>
  StyleSheet.create({
    gridContainer: {
      // position: "absolute",
      // minWidth: "100%",
      // margin: "auto",
      // left: screenWidth/2 - GRID_SIZE/2,
      // right:"25%",
      flexWrap: 'wrap',
      height: GRID_SIZE_1 + 7,
      width: GRID_SIZE_1 + 7,
      borderWidth: 3,
      borderRadius: 5,
      // alignSelf: "center",
      borderColor: 'black',
      backgroundColor: 'black',
      // zIndex: 100
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
      // elevation: raiseSquare ? 5 : 0,
      // shadowColor: raiseSquare ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
      // shadowOffset: raiseSquare ? { width: 0, height: 3 } : null,
      // shadowOpacity: raiseSquare ? 0.2 : 0,
      // backgroundColor: "grey",
      // zIndex: 100
    },
    text: {
      // color: 'rgb(250, 250, 215)',
      color: 'rgb(255, 224, 160)',
      // fontSize: 50,
    },
  });

export default Grid;
