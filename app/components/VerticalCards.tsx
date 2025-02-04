import React, { useState, useRef, useEffect, useCallback, useMemo, memo} from "react";
import { Dimensions, StyleSheet, FlatList, Text, TouchableOpacity, Pressable, View} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, useDerivedValue } from "react-native-reanimated";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { GRID_SIZE, gridStyles } from "./GridLayout";
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

const VerticalCards = memo(() => { 
  const [expanded, setExpanded] = useState(false);
  const expandedGridset = useRef()
  const navigation = useNavigation();
  const width = Dimensions.get('window').width;

  const isVerticalReel = (gridset) => {
    expandedGridset.current = bingoGames[gridset]
    setExpanded(!expanded)
  }
  const handleNavigation = () => navigation.navigate("Profile")

  const renderGridset = ({item, index}) => (
    <TouchableOpacity onPress={() => isVerticalReel(item)} style={[styles.gridSetHeader]}>
      <Text>{item}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={{height: "100%"}}>
      <View style={styles.header}>``
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person-circle-outline" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Ionicons name="settings-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <Carousel
        loop
        width={width}
        height={width / 2}
        style={{height: GRIDSET_HEADER_SIZE, position:"absolute", top:100}}
        autoPlay={!expanded}
        autoPlayInterval={1000}
        data={Object.keys(bingoGames)}
        scrollAnimationDuration={1500}
        windowSize={2}
        // panGestureHandlerProps={{
        //   activeOffsetX: expanded ? [-9999, 9999] : [-10, 10]
        // }}
        renderItem={renderGridset}
      />
      {
        expanded 
          ? <Pressable style={styles.pressableScreen} onPress={isVerticalReel}>
              <ScrollView >
                <View style={verticalReelStyles(expanded, expandedGridset)}>
                {expandedGridset.current.map((grid, gridIndex) => {
                  return (
                  <TouchableOpacity 
                    key={gridIndex} 
                    activeOpacity={1} 
                    style={[gridStyles().gridContainer, {flexWrap: "wrap"}]} onPress={handleNavigation}
                  >
                    {grid.map((square, squareIndex) => (
                      <View key={squareIndex} style={[gridStyles().square]}><Text>{square}</Text></View>)
                    )}
              
                  </TouchableOpacity>
                  )
                })}
                </View>
              </ScrollView>
            </Pressable> 
          : null
        }
    </View>
  );
});

const styles = StyleSheet.create({
    header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: "5%",
  },
  gridSetHeader: {
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
    backgroundColor: "white"
  }
});

const verticalReelStyles = (expanded, expandedGridset) => StyleSheet.create({
  paddingTop: 30,
  paddingBottom: 30,
  minHeight: (
    expanded 
      ? expandedGridset.current.length * (GRIDSET_HEADER_SIZE)
      : GRID_CONTAINER_SIZE
  ),
  justifyContent: "space-between",
  alignItems: "center"
})

export default VerticalCards;
