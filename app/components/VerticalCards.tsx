import React, { useState, useRef, useEffect, useCallback, useMemo, memo} from "react";
import { Dimensions, StyleSheet, FlatList, Text, TouchableOpacity, Pressable, View} from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, useDerivedValue } from "react-native-reanimated";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { GRID_SIZE } from "./GridLayout";
import Grid from "./GridLayout";
import { FlashList } from "@shopify/flash-list";

import bingoGames from "../templateFixtures";

import Carousel from 'react-native-reanimated-carousel';

import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import { ScrollView } from "react-native-gesture-handler";
import { transform } from "@babel/core";

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

const GRID_CONTAINER_SIZE = GRID_SIZE + 15;
const GRIDSET_HEADER_SIZE = GRID_CONTAINER_SIZE + 10;
const GAME_SETS = Object.keys(bingoGames)

const VerticalCards = memo(() => { 
  const [expanded, setExpanded] = useState(false);
  // const [expandedGridSet, setExpandedGridSet] = useState(0)
  const expandedGridSet = useRef()
  const navigation = useNavigation();
  const width = Dimensions.get('window').width;
  // const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // const headerCardY = GAME_SETS.map(_ => useSharedValue(100)) 
  const headerCardY = useSharedValue(100)
 
  // const gridSetY = GAME_SETS.map((gameSet, setIndex) => ( 
  //   // withTiming(gameIndex * (GRID_CONTAINER_SIZE + GRID_CONTAINER_GAP), { duration: 500 })
  //   bingoGames[gameSet].map((_, gameIndex) => useDerivedValue(() => {
  //     return headerCardY[setIndex].value < 1 ? withTiming(GRID_CONTAINER_SIZE + ( (gameIndex+1) * GRID_CONTAINER_GAP), { duration: 500 }) : 0;
  //     })
  // )));
  const gridSetY = GAME_SETS.map((gameSet, setIndex) => ( 
    // withTiming(gameIndex * (GRID_CONTAINER_SIZE + GRID_CONTAINER_GAP), { duration: 500 })
    bingoGames[gameSet].map((_, gameIndex) => useDerivedValue(() => {
      return headerCardY.value < 1 ? withTiming(gameIndex * (GRID_CONTAINER_SIZE),  { duration: 500 }) : 0;
      })
  )));

  // const headerAnimated = GAME_SETS.map((_, index) => useAnimatedStyle(() => ({
  //   transform:[{translateY: headerCardY[index].value}]
  // })))
  const headerAnimated = useAnimatedStyle(() => ({transform:[{translateY: headerCardY.value}]}))

  const animatedStyles = GAME_SETS.map((gameSet, setIndex) => {
    return ( bingoGames[gameSet].map((game, gameIndex) => {
      return ( useAnimatedStyle(() => ({
        transform: [{ translateY: gridSetY[setIndex][gameIndex].value }],
        opacity: headerCardY.value < 1 ? 1 : 0
        // opacity: 0,
      })
    ))
    }))
  });
  // useEffect(() => {
  //   if (!isAutoPlaying) { 
  //     setExpanded(true)
  //   }
  // }, [isAutoPlaying])
  // useFocusEffect(
  //   useCallback(() => {
  //     console.log("c = ", expandedGridSet.current, headerCardY)
  //     headerCardY[expandedGridSet.current].value = 0; // Reset the value when the screen is focused
  //   }, [])
  // );
  const handleExpand = useCallback((index) => {

    if (!expanded) {
        // setExpandedGridSet(index)
        expandedGridSet.current = index

        setExpanded(true)
        // headerCardY[index].value = withTiming(0, {duration: 800})
        headerCardY.value = withTiming(0, {duration: 800})
        
    }
    if (expanded) {
      setExpanded(false)
      headerCardY.value = 100
      navigation.navigate("Profile")
    }
  }, [expanded])

  const handleCollapse = useCallback(() => {
    if (expanded) {
      bingoGames[GAME_SETS[expandedGridSet.current]].forEach((_, gameIndex) => (
        gridSetY[expandedGridSet.current][gameIndex].value = withTiming(0, { duration: 500 }
      )));
      // headerCardY[expandedGridSet.current].value = withTiming(100, {duration: 800})
      headerCardY.value = withTiming(100, {duration: 800})
      setExpanded(false);
    }
  }, [expanded]);

  return (
    <View style={{height: "100%"}}>
      <Carousel
        loop
        width={width}
        height={width / 2}
        style={[{height: GRIDSET_HEADER_SIZE},headerAnimated]}
        autoPlay={!expanded}
        autoPlayInterval={1000}
        data={GAME_SETS}
        scrollAnimationDuration={1500}
        windowSize={2}
        panGestureHandlerProps={{
          activeOffsetX: expanded ? [-9999, 9999] : [-10, 10]
        }}
        renderItem={({item, index}) => <TouchableOpacity onPress={() => handleExpand(index)} style={[styles().gridSetHeader]}><Text>{item}</Text></TouchableOpacity>}
      />
      {
        expanded 
          ? <Pressable style={styles().pressableScreen} onPress={handleCollapse}>
              <ScrollView style={styles(expanded).verticalGridSetContainer}>
                <View style={{backgroundColor: "black", minHeight: (
                  expanded 
                    ? bingoGames[GAME_SETS[expandedGridSet.current]].length * (GRID_CONTAINER_SIZE) + 80
                    : GRID_CONTAINER_SIZE
                )}}>
                {bingoGames[GAME_SETS[expandedGridSet.current]].map((item, index) => {
                  return (
                  <Animated.View style={[animatedStyles[expandedGridSet.current][index]]}>
                  {/* <Animated.View> */}
                    <Grid gridData={item} gridType="template" />
                  </Animated.View>
                  )
                })}
                </View>
              </ScrollView>
              {/* </View> */}
            </Pressable> 
          : null
        }
    </View>
  );
});

// TODO: I should be able to get rid of expanded here
const styles = (expanded=null) => StyleSheet.create({
  gridSetHeader: {
    // position: "absolute",
    width: GRIDSET_HEADER_SIZE,
    height: GRIDSET_HEADER_SIZE,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "black",
    backgroundColor:"white"
  },
  pressableScreen: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    // backgroundColor: "green",

    
    // height: (
    //   expanded 
    //     ? (GAME_SETS.length+1) * (GRID_CONTAINER_SIZE + GRID_CONTAINER_GAP)  
    //     : GRID_CONTAINER_SIZE + GRID_CONTAINER_GAP)
    // minHeight: (
    //   expanded
    //     ? GAME_SETS.length * (GRID_CONTAINER_SIZE + GRID_CONTAINER_GAP)
    //     : GRID_CONTAINER_SIZE
    // ),
    // minHeight: 1000,
    backgroundColor: "blue"
  },
  verticalGridSetContainer: { 

    // minHeight: (
    //   expanded 
    //     ? GAME_SETS.length * (GRID_CONTAINER_SIZE + GRID_CONTAINER_GAP)  
    //     : GRID_CONTAINER_SIZE + GRID_CONTAINER_GAP
    // ),
    // minHeight: 1000,
    // backgroundColor: "green"
  },
});

export default VerticalCards;
