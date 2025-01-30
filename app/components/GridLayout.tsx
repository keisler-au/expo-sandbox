import React, { useContext, memo, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, FlatList } from 'react-native';
import { GridDataContext } from './GridDataProvider';


const GRID_CONTAINER_SIZE = 250;
const GRID_CONTAINER_GAP = 15;


const GridSquare = memo(({ squareData, onPress, gridType}) => {
    return (
    gridType === "template"
        ? <View style={styles().square}><Text>{squareData}</Text></View>
        : <TouchableOpacity onPress={onPress} style={styles(raiseSquare).square}>
            <Text>{squareData}</Text>
        </TouchableOpacity> 
    )});
    

const Grid = memo(({ gridData, gridType, onSquarePress }) => {
    // const { gridData, setGridData } = useContext(GridDataContext);
    // TODO: Does it impact performance and if so how to conditionally pass in onPress
    const renderSquare = useCallback(({ item, index }) => (
        // <GridSquare
        //     key={index}
        //     squareData={item}
        //     onPress={() => onSquarePress(index)}
        //     gridType={gridType}
        // />
        <Text>Yep</Text>
    ), [onSquarePress]);
    const keyExtractor = (item, index) => Array.isArray(item) ? item[index] : item
    const renderRow = useCallback(({ item }) => {
        return (<Text>Yep</Text>
        // return (
        // <FlatList
        //     data={item}
        //     renderItem={renderSquare}
        //     keyExtractor={keyExtractor}
        //     horizontal
        //     showsHorizontalScrollIndicator={false}
        //     scrollEnabled={false}
        //     // getItemLayout={(data, index) => ({
        //     //     length: GRID_CONTAINER_SIZE/item.length,
        //     //     offset: GRID_CONTAINER_SIZE/item.length * index,
        //     //     index,
        //     // })}
        // />
    )}, []);
    return <Text>Yep</Text>
    return (
        <FlatList
            data={gridData}
            renderItem={renderRow}
            keyExtractor={keyExtractor}
            style={styles().gridContainer}
            showsVerticalScrollIndicator={false}
            // getItemLayout={(data, index) => ({
            //     length: GRID_CONTAINER_SIZE + 2,
            //     offset: (GRID_CONTAINER_SIZE + 2) * index,
            //     index,
            // })}
        />
    );
});

const styles = (raiseSquare=null, rows=5, columns=5) =>
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