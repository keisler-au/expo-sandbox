import React, { useState, useRef, memo} from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, Pressable, View} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { GRID_SIZE, gridStyles } from "./GridLayout";
// import { LinearGradient } from "expo-linear-gradient";
import Svg, { Defs, RadialGradient, LinearGradient, Rect, Stop } from "react-native-svg";

import bingoGames from "../templateFixtures";

import Carousel from 'react-native-reanimated-carousel';

import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";


const { width } = Dimensions.get('window');

const GRID_CONTAINER_SIZE = GRID_SIZE + 15;
const GRIDSET_HEADER_SIZE = width / 1.25;
const SCREEN_BACKGROUND_COLOR = "rgb(27, 33, 36)"
const SCREEN_TEXT_COLOR = "rgb(212, 175, 55)"

const VerticalCards = memo(() => { 
  const [expanded, setExpanded] = useState(false);
  const expandedGridset = useRef()
  const navigation = useNavigation();


  const isVerticalReel = (gridset) => {
    expandedGridset.current = bingoGames[gridset]
    setExpanded(!expanded)
  }
  const handleNavigation = () => navigation.navigate("Profile")

  const renderGridsetHeader = ({item}) => {
    return (
      <TouchableOpacity onPress={() => isVerticalReel(item)} activeOpacity={1} style={styles.gridsetHeader}>
        <Svg height={GRIDSET_HEADER_SIZE} width={GRIDSET_HEADER_SIZE} style={{position:"absolute"}}>
          <Defs>
            <RadialGradient id="grad" cx="50%" cy="50%" r="90%">
              <Stop offset="20%" stopColor="rgb(14, 14, 15)" stopOpacity="1" />
              <Stop offset="100%" stopColor="rgb(79,77,77)" stopOpacity="1" />
            </RadialGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#grad)" />
        </Svg>
        

        {Array.from({ length: 5 }).map((_, rowIndex) => (
          <View key={rowIndex} style={styles.gridsetHeaderRow}>
            {Array.from({ length: 5 }).map((_, colIndex) => (
              <View key={colIndex} style={styles.gridsetHeaderSquare} />
            ))}
          </View>
        ))}
        <View style={styles.gridsetHeaderLabelContainer}><Text style={styles.gridsetHeaderLabel}>{item}</Text></View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person-circle-outline" size={30} color={SCREEN_TEXT_COLOR} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Ionicons name="settings-outline" size={30} color={SCREEN_TEXT_COLOR} />
        </TouchableOpacity>
      </View>
      <Carousel
        loop
        width={width}
        height={GRIDSET_HEADER_SIZE}
        style={styles.carousel}
        // autoPlay={!expanded}
        autoPlayInterval={1000}
        data={Object.keys(bingoGames)}
        scrollAnimationDuration={1500}
        windowSize={2}
        // panGestureHandlerProps={{
        //   activeOffsetX: expanded ? [-9999, 9999] : [-10, 10]
        // }}
        renderItem={renderGridsetHeader}
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
    </SafeAreaView>
  );
});



const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: "5%",
  },
  background: {
    // justifyContent: "center",
    // alignItems: "center",
    height: "100%", 
    backgroundColor: SCREEN_BACKGROUND_COLOR
  },
  carousel: {
    // width: GRIDSET_HEADER_SIZE,
    top:100, 
    // backgroundColor: "green"
  },
  gridsetHeader: {
    alignItems: 'center',
  },
  gridsetHeaderRow: {
    flexDirection: 'row',
    // width: '100%',
  },
  gridsetHeaderSquare: {
    maxWidth: GRIDSET_HEADER_SIZE / 5,
    height: GRIDSET_HEADER_SIZE / 5,
    // padding: 10,
    // backgroundColor: 'rgb(175, 170, 170)', // Blue color for the square
    // borderRadius: 10, // Optional, to make it slightly rounded
    // shadowColor: '#000', // Shadow color (black)
    // shadowOpacity: 0.3, // Shadow transparency
    // shadowRadius: 6, // Blur radius of the shadow
    // elevation: 10, // For Android to show shadow
    flexGrow: 1,
    backgroundColor: 'transparent',
    // borderRadius: 5,
    borderWidth: 5,
    borderColor: SCREEN_BACKGROUND_COLOR
  },
  gridsetHeaderLabelContainer: {
    position: "absolute",
    top: "32.5%", 
    backgroundColor: "rgb(50, 50, 50)",
    borderRadius: 0,
    width: 110,
    height: 110,
    justifyContent: "center",
    // alignItems: "center"
    // backgroundColor: 'rgb(175, 170, 170)', // Blue color for the square
    // borderRadius: 10, // Optional, to make it slightly rounded
    shadowColor: SCREEN_TEXT_COLOR, // Shadow color (black)
    shadowOpacity: 0.8, // Shadow transparency
    shadowRadius: 20, // Blur radius of the shadow
    elevation: 10, // For Android to show shadow
  },
  gridsetHeaderLabel: {
    color: SCREEN_TEXT_COLOR,
    padding: 5,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    // fontFamily: 'Courier New'
    fontFamily: "Verdana"
    // fontFamily: "Spectral"
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
      ? expandedGridset.current.length * (GRID_CONTAINER_SIZE + 10)
      : GRID_CONTAINER_SIZE
  ),
  justifyContent: "space-between",
  alignItems: "center"
})

VerticalCards.displayName = "VerticalCards";
export default VerticalCards;
