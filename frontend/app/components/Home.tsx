import React, { useState, useRef, memo, useEffect } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  Pressable,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Carousel from 'react-native-reanimated-carousel';
import Svg, {
  Defs,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import { useSharedValue } from 'react-native-reanimated';

import bingoGames from '../templateFixtures';

import { GRID_SIZE, gridStyles } from './GridLayout';
import VerificationCodeInput from './Join';
import IconHeader from './IconHeader';
import { getItemAsync } from 'expo-secure-store';
import CreatePlayerModal from './CreateProfileModal';





const { width } = Dimensions.get('window');

const GRID_CONTAINER_SIZE = GRID_SIZE + 15;
const GRIDSET_HEADER_SIZE = width / 1.85;
const BOX_NUM = 3;
// const SCREEN_BACKGROUND_COLOR = 'rgb(27, 33, 36)';
// const SCREEN_TEXT_COLOR = 'rgb(212, 175, 55)';
// const MAIN_SQUARE_COLOR = 'rgb(50, 50, 50)';
const MAIN_FONT_FAMILY = 'Verdana';

const SCREEN_TEXT_COLOR = '';
const MAIN_SQUARE_COLOR = '';
const SCREEN_BACKGROUND_COLOR = '';




const GridTemplate = () => (
  Array.from({ length: BOX_NUM }).map((_, rowIndex) => (
    <View key={rowIndex} style={styles.gridsetHeaderRow}>
      {Array.from({ length: BOX_NUM }).map((_, colIndex) => (
        <View key={colIndex} style={styles.gridsetHeaderSquare} />
      ))}
    </View>
  ))
)

const GridsetHeaderBackground = () => (
  <Svg
    height={GRIDSET_HEADER_SIZE}
    width={GRIDSET_HEADER_SIZE}
    style={{ position: 'absolute', borderRadius: 50 }}>
    <Defs>
      <RadialGradient id="grad" cx="50%" cy="50%" r="90%">
        {/* <Stop offset="20%" stopColor={"rgb(14, 14, 15)"} stopOpacity="1" />
        <Stop offset="100%" stopColor="rgb(79,77,77)" stopOpacity="1" /> */}
        <Stop offset="20%" stopColor="" stopOpacity="1" />
        <Stop offset="100%" stopColor="" stopOpacity="1" />
      </RadialGradient>
    </Defs>
    <Rect width="100%" height="100%" fill="url(#grad)" rx="22" ry="22" />
  </Svg>
)

const VerticalReel = ({ collapseReel, expandedGridset }) => {
  const navigation = useNavigation();
  
  const handleNavigation = (gameIndex) => (
    navigation.navigate('Publish', { game: expandedGridset.current[gameIndex] }) 
  );

  return (
    <Pressable style={styles.pressableScreen} onPress={collapseReel}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={verticalReelStyles(expandedGridset.current.length)}>
          {expandedGridset.current.map((grid, gridIndex) => { 
            return (
              <TouchableOpacity
                key={gridIndex}
                activeOpacity={1}
                style={[gridStyles().gridContainer, { flexWrap: 'wrap' }]}
                onPress={() => handleNavigation(gridIndex)}>
                {grid.map((square, squareIndex) => (
                  <View key={squareIndex} style={[gridStyles().square]}>
                    <Text style={gridStyles().text}>{square}</Text>
                  </View>
                ))}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </Pressable>
  )
}

const Home = memo(() => {
  const [expanded, setExpanded] = useState(false);
  const [displayPlayerModal, setDisplayPlayerModal] = useState(false);
  const expandedGridset = useRef();

  const isVerticalReel = (gridset) => {
    expandedGridset.current = bingoGames[gridset];
    setExpanded(!expanded);
  };


  const renderGridsetHeader = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => isVerticalReel(item)}
        activeOpacity={1}
        style={styles.gridsetHeader}
      >
        {/* <GridsetHeaderBackground /> */}
        <GridTemplate />
        <View style={styles.gridsetHeaderLabelContainer}>
          <Text style={styles.gridsetHeaderLabel}>{item}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  const progress = useSharedValue<number>(0);

  return (
    <SafeAreaView style={styles.background}>
      <IconHeader 
        type={["settings-outline", "person-circle-outline"]} 
        paths={["Settings", "Profile"]}
        onChange={() => setDisplayPlayerModal(true)}
      />
      <Carousel
        loop
        width={width}
        height={GRIDSET_HEADER_SIZE}
        style={styles.carousel}
        // autoPlay={!expanded}
        // autoPlay={false}
        // autoPlayInterval={1000}
        // autoPlay
        snapEnabled
        data={Object.keys(bingoGames)}
        scrollAnimationDuration={1200}
        // windowSize={2}
        renderItem={renderGridsetHeader}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        onProgressChange={progress}
      />
      {expanded 
        ? <VerticalReel 
          collapseReel={isVerticalReel} 
          expandedGridset={expandedGridset}
        /> 
        : <VerificationCodeInput joinGame={!expanded} />}
        <CreatePlayerModal displayModal={displayPlayerModal} onClose={() => setDisplayPlayerModal(false)} />
    </SafeAreaView>

  );
});

const styles = StyleSheet.create({
  background: {
    height: '100%',
    // backgroundColor: SCREEN_BACKGROUND_COLOR,
    position: "relative",
  },
  carousel: {
    width: width,
    // top: 110,
    // top: 65,

  },
  gridsetHeader: {
    alignItems: 'center',
  },
  gridsetHeaderRow: {
    flexDirection: 'row',
  },
  gridsetHeaderSquare: {
    maxWidth: 50,
    height: 50,
    borderWidth: 1,
    flex: 1,
    margin: 10,
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10, // Shadow for Android
    // shadowOpacity: 0.2,
    // shadowRadius: completed ? 0 : 1,
    shadowOffset: { width: 0, height: 4 },
    opacity: 0.15,
    borderRadius: 5,

    // maxWidth: GRIDSET_HEADER_SIZE / BOX_NUM,
    // height: GRIDSET_HEADER_SIZE / BOX_NUM,
    // flexGrow: 1,
    // backgroundColor: 'transparent',
    // borderWidth: 8,
    // borderColor: SCREEN_BACKGROUND_COLOR,
  },
  gridsetHeaderLabelContainer: {
    top: "30%",
    bottom: "30%",
    width: "50%",
        // backgroundColor: "blue",

    position: 'absolute',
    // top: '32.5%',
    // backgroundColor: MAIN_SQUARE_COLOR,
    // borderRadius: 0,
    // width: 110,
    // height: 110,
    justifyContent: 'center',
    // shadowColor: SCREEN_TEXT_COLOR,
    // shadowOpacity: 0.8,
    // shadowRadius: 20,
    // elevation: 10,
  },
  gridsetHeaderLabel: {
    // color: "#FFF",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,

    // color: SCREEN_TEXT_COLOR,
    // padding: 5,
    // fontSize: 16,
    // padding: 0,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: MAIN_FONT_FAMILY,
  },
  pressableScreen: {
    // backgroundColor: "#e0e0e0",
    backgroundColor: "#F0F0F0",

    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    // backgroundColor: SCREEN_BACKGROUND_COLOR,
  },
});

const verticalReelStyles = (numOfGrids) =>
  StyleSheet.create({
    // backgroundColor: SCREEN_BACKGROUND_COLOR,
    paddingTop: 120,
    paddingBottom: 60,
    minHeight: numOfGrids * (GRID_CONTAINER_SIZE + 10),
    gap: 90,
    alignItems: 'center',
  });

Home.displayName = 'Home';
export default Home;

// TODO: enabled copy and pasting entire code into all 6 boxes at once
