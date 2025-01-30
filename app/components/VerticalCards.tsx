import React, { useState, useCallback, useMemo, memo} from "react";
import { Dimensions, StyleSheet, FlatList, View, TouchableOpacity, Text, Pressable} from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import GridDataProvider from "./GridDataProvider";
import TemplateGrid from "./GridTypes";
import { GRID_CONTAINER_GAP, GRID_CONTAINER_SIZE } from "./GridLayout";
import Grid from "./GridLayout";

import bingoGames from "../templateFixtures";

import Carousel from 'react-native-reanimated-carousel';


const VerticalCards = memo(() => { 
  const [expanded, setExpanded] = useState(false);
  const navigation = useNavigation();
  const width = Dimensions.get('window').width;

  const initialOffsets = index => index < 2 ? (index * 5) : 10;
  const expandedOffsets = bingoGames.map((gameSet) => (
    gameSet.map((_, gameIndex) => useSharedValue(initialOffsets(gameIndex))
  )))

  const animatedStyles = bingoGames.map((gameSet, setIndex) =>
    gameSet.map((_, gameIndex) =>
      useAnimatedStyle(() => ({
        transform: [{ translateY: expandedOffsets[setIndex][gameIndex].value }]
      }))
    )
  );

  const handleExpand = useCallback(({gameIndex, gameSetIndex}) => {
    if (!expanded) {
      // bingoGames.forEach((_, setIndex) => {
      //   expandedOffsets[setIndex].value = withTiming(
      //     index * (GRID_CONTAINER_SIZE + GRID_CONTAINER_GAP), { duration: 500 }
      //   );
      // });
      bingoGames[gameSetIndex].forEach((_, gameIndex) => (
        expandedOffsets[gameSetIndex][gameIndex].value = withTiming(
        gameIndex * (GRID_CONTAINER_SIZE + GRID_CONTAINER_GAP), { duration: 500 }
      )));
      setExpanded(true);
    }
    if (expanded) {
      navigation.navigate("Profile")
    }
  }, [expanded]);

  const handleCollapse = useCallback(({gameSetIndex}) => {
    if (expanded) {
      bingoGames[gameSetIndex].forEach((_, gameIndex) => (
        expandedOffsets[gameSetIndex][gameIndex].value = withTiming(initialOffsets(index), { duration: 500 }
      )));
      setExpanded(false);
    }
  }, [expanded]);
  const renderGrid = useCallback(({item, index, gameSetIndex}) => {
    return (
    // <GridDataProvider initialGridData={item} cardId={1}>
      <TouchableOpacity 
        activeOpacity={expanded ? 0.2 : 1}
        onPress={() => handleExpand(gameSetIndex)} 
        style={{ zIndex: (bingoGames.length - index) }}
      >
        <Animated.View style={[styles().grid, animatedStyles[index]]}>
          <Grid gridData={item} gridType="template" onSquarePress={()=>{}} />
        </Animated.View>
      </TouchableOpacity>
    // </GridDataProvider>
  )}, [expanded]);
  const keyExtractor = (item, index) => index.toString()
  const renderGridSet = useCallback(({item, index: gameSetIndex}) => {
    return<Text>ohkay</Text>
    return (
    <Pressable style={styles(expanded).pressableScreen} onPress={() => handleCollapse(gameSetIndex)}>
      <FlatList
        data={item}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles(expanded).gridContainer}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        updateCellsBatchingPeriod={6000} 
        renderItem={(props) => renderGrid({...props, gameSetIndex})}
      />
    </Pressable>)}

  , [expanded, handleCollapse]);

  return (
    <Carousel
      loop
      // width={width}
      // height={width / 2}
      width={500}
      height={500}
      style={{flex: 1, backgroundColor: "blue", height: 200}}
      // autoPlay={!expanded}
      data={bingoGames}
      // scrollAnimationDuration={1500}
      // windowSize={2}
      // panGestureHandlerProps={{
      //   activeOffsetX: expanded ? [-9999, 9999] : [-10, 10]
      // }}
      renderItem={({item, index}) => {console.log("render please") 
        return <View style={styles().pressableScreen}><Text>HEllo</Text></View>}}
    />
  );
});

const styles = (expanded=null) => StyleSheet.create({
  // pressableScreen: { minHeight: "100%", backgroundColor: "green"},
    pressableScreen: { minHeight: 500, backgroundColor: "green"},
  gridContainer: { 
    height: (
      expanded 
        ? bingoGames.length * (GRID_CONTAINER_SIZE + GRID_CONTAINER_GAP)  
        : GRID_CONTAINER_SIZE
    ),
    backgroundColor: "black"
  },
  grid: {
    position: "absolute",
    width: GRID_CONTAINER_SIZE,
    height: GRID_CONTAINER_SIZE,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "black"
  },
});

export default VerticalCards;
