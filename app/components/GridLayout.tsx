import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, FlatList } from 'react-native';
import { GridDataContext } from './GridDataProvider';


const GRID_CONTAINER_SIZE = 250;
const GRID_CONTAINER_GAP = 15;


const GridSquare = ({ squareData, onPress, gridType}) => (
    gridType === "template"
        ? <View style={styles().square}><Text>{squareData}</Text></View>
        : <TouchableOpacity onPress={onPress} style={styles(raiseSquare).square}>
            <Text>{squareData}</Text>
        </TouchableOpacity> 
    );
    

const Grid = ({ gridType, onSquarePress }) => {
    const { gridData, setGridData } = useContext(GridDataContext);
    const renderRow = ({ item, index }) => (
        <FlatList
            data={item}
            renderItem={({ item: square, index: colIndex }) => (
                <GridSquare
                    key={colIndex}
                    squareData={square}
                    onPress={() => onSquarePress(index, colIndex)}
                    gridType={gridType}
                />
            )}
            keyExtractor={(item, colIndex) => colIndex.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
        />
    );

    return (
        <FlatList
            data={gridData}
            renderItem={renderRow}
            keyExtractor={(item, rowIndex) => rowIndex.toString()}
            style={styles().gridContainer}
            showsVerticalScrollIndicator={false}
        />
    );
};

const styles = (raiseSquare=null, columns=5, rows=5) =>
  StyleSheet.create({
    gridContainer: {
        margin: "auto",
        height: GRID_CONTAINER_SIZE + 2,
        width: GRID_CONTAINER_SIZE + 2,
        borderWidth: 1,
        // alignSelf: "center",
        borderColor: "black",
    },
    square: {
        height: GRID_CONTAINER_SIZE/rows,
        width: GRID_CONTAINER_SIZE/columns,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        backgroundColor: raiseSquare ? '#FFF' : '#F5F5F5',
        elevation: raiseSquare ? 5 : 0,
        shadowColor: raiseSquare ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
        shadowOffset: raiseSquare ? { width: 0, height: 3 } : null,
        shadowOpacity: raiseSquare ? 0.2 : 0,
    }
  });

export default Grid;

export {GRID_CONTAINER_SIZE, GRID_CONTAINER_GAP}