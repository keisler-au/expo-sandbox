import React, { memo,} from 'react';
import { View, StyleSheet, Text, FlatList, Dimensions } from 'react-native';


export const GRID_SIZE = 250
const screenWidth = Dimensions.get("window").width;

const Grid = memo(({ gridData, gridType, onSquarePress }) => {

    return (
        <View style={[styles().gridContainer]}>
        {gridData.map((item, index) => <View key={index} style={[styles().square]}><Text>{item}</Text></View>)}
        </View>
    
)
});

export const gridStyles = (raiseSquare=null, rows=5, columns=5) =>
  StyleSheet.create({
    gridContainer: {
        // position: "absolute",
        // minWidth: "100%",
        // margin: "auto",
        // left: screenWidth/2 - GRID_SIZE/2,
        // right:"25%",
        flexWrap: "wrap",
        height: GRID_SIZE + 2,
        width: GRID_SIZE + 2,
        borderWidth: 1,
        // alignSelf: "center",
        borderColor: "black",
        backgroundColor: "white",
        // zIndex: 100
    },
    square: {
        height: GRID_SIZE/rows,
        width: GRID_SIZE/columns,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        // backgroundColor: raiseSquare ? '#FFF' : '#F5F5F5',
        elevation: raiseSquare ? 5 : 0,
        shadowColor: raiseSquare ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
        shadowOffset: raiseSquare ? { width: 0, height: 3 } : null,
        shadowOpacity: raiseSquare ? 0.2 : 0,
        // backgroundColor: "grey",
        // zIndex: 100
    }
  });

export default Grid;
