import React, { useState, useRef, memo } from 'react';
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

import bingoGames from '../templateFixtures';

import { GRID_SIZE, gridStyles } from './GridLayout';
import VerificationCodeInput from './Join';
import IconHeader from './IconHeader';




const { width } = Dimensions.get('window');

const GRID_CONTAINER_SIZE = GRID_SIZE + 15;
const GRIDSET_HEADER_SIZE = width / 1.25;
const SCREEN_BACKGROUND_COLOR = 'rgb(27, 33, 36)';
const SCREEN_TEXT_COLOR = 'rgb(212, 175, 55)';
const MAIN_SQUARE_COLOR = 'rgb(50, 50, 50)';
const MAIN_FONT_FAMILY = 'Verdana';





const GridTemplate = () => (
  Array.from({ length: 5 }).map((_, rowIndex) => (
    <View key={rowIndex} style={styles.gridsetHeaderRow}>
      {Array.from({ length: 5 }).map((_, colIndex) => (
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
        <Stop offset="20%" stopColor="rgb(14, 14, 15)" stopOpacity="1" />
        <Stop offset="100%" stopColor="rgb(79,77,77)" stopOpacity="1" />
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
        <GridsetHeaderBackground />
        <GridTemplate />
        <View style={styles.gridsetHeaderLabelContainer}>
          <Text style={styles.gridsetHeaderLabel}>{item}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.background}>
      <IconHeader 
        type={["person-circle-outline", "settings-outline"]} 
        paths={["Profile", "Settings"]}
      />
      <Carousel
        loop
        width={width}
        height={GRIDSET_HEADER_SIZE}
        style={styles.carousel}
        autoPlay={!expanded}
        autoPlayInterval={1000}
        data={Object.keys(bingoGames)}
        scrollAnimationDuration={1000}
        windowSize={2}
        renderItem={renderGridsetHeader}
      />
      {expanded 
        ? <VerticalReel 
          collapseReel={isVerticalReel} 
          expandedGridset={expandedGridset}
        /> 
        : <VerificationCodeInput />}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  background: {
    height: '100%',
    backgroundColor: SCREEN_BACKGROUND_COLOR,
    position: "relative",
  },
  carousel: {
    top: 65,
  },
  gridsetHeader: {
    alignItems: 'center',
  },
  gridsetHeaderRow: {
    flexDirection: 'row',
  },
  gridsetHeaderSquare: {
    maxWidth: GRIDSET_HEADER_SIZE / 5,
    height: GRIDSET_HEADER_SIZE / 5,
    flexGrow: 1,
    backgroundColor: 'transparent',
    borderWidth: 5,
    borderColor: SCREEN_BACKGROUND_COLOR,
  },
  gridsetHeaderLabelContainer: {
    position: 'absolute',
    top: '32.5%',
    backgroundColor: MAIN_SQUARE_COLOR,
    borderRadius: 0,
    width: 110,
    height: 110,
    justifyContent: 'center',
    shadowColor: SCREEN_TEXT_COLOR,
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  gridsetHeaderLabel: {
    color: SCREEN_TEXT_COLOR,
    padding: 5,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: MAIN_FONT_FAMILY,
  },
  pressableScreen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: SCREEN_BACKGROUND_COLOR,
  },
});

const verticalReelStyles = (numOfGrids) =>
  StyleSheet.create({
    backgroundColor: SCREEN_BACKGROUND_COLOR,
    paddingTop: 120,
    paddingBottom: 60,
    minHeight: numOfGrids * (GRID_CONTAINER_SIZE + 10),
    gap: 90,
    alignItems: 'center',
  });

Home.displayName = 'Home';
export default Home;

// TODO: enabled copy and pasting entire code into all 6 boxes at once
