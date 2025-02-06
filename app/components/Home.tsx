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
import { GRID_SIZE, gridStyles } from './GridLayout';
// import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  Defs,
  RadialGradient,
  LinearGradient,
  Rect,
  Stop,
} from 'react-native-svg';

import bingoGames from '../templateFixtures';

import Carousel from 'react-native-reanimated-carousel';

import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import VerificationCodeInput from './Join';

const { width } = Dimensions.get('window');

const GRID_CONTAINER_SIZE = GRID_SIZE + 15;
const GRIDSET_HEADER_SIZE = width / 1.25;
const SCREEN_BACKGROUND_COLOR = 'rgb(27, 33, 36)';
const SCREEN_TEXT_COLOR = 'rgb(212, 175, 55)';
const MAIN_SQUARE_COLOR = 'rgb(50, 50, 50)';
const MAIN_FONT_FAMILY = 'Verdana';

const Home = memo(() => {
  const [expanded, setExpanded] = useState(false);
  const expandedGridset = useRef();
  const navigation = useNavigation();

  const isVerticalReel = (gridset) => {
    expandedGridset.current = bingoGames[gridset];
    setExpanded(!expanded);
  };
  const handleNavigation = () => navigation.navigate('Profile');

  const renderGridsetHeader = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => isVerticalReel(item)}
        activeOpacity={1}
        style={styles.gridsetHeader}>
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

        {Array.from({ length: 5 }).map((_, rowIndex) => (
          <View key={rowIndex} style={styles.gridsetHeaderRow}>
            {Array.from({ length: 5 }).map((_, colIndex) => (
              <View key={colIndex} style={styles.gridsetHeaderSquare} />
            ))}
          </View>
        ))}
        <View style={styles.gridsetHeaderLabelContainer}>
          <Text style={styles.gridsetHeaderLabel}>{item}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Ionicons
            name="person-circle-outline"
            size={30}
            color={SCREEN_TEXT_COLOR}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons
            name="settings-outline"
            size={30}
            color={SCREEN_TEXT_COLOR}
          />
        </TouchableOpacity>
      </View>
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
      {expanded ? (
        <Pressable style={styles.pressableScreen} onPress={isVerticalReel}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={verticalReelStyles(expanded, expandedGridset)}>
              {expandedGridset.current.map((grid, gridIndex) => {
                return (
                  <TouchableOpacity
                    key={gridIndex}
                    activeOpacity={1}
                    style={[gridStyles().gridContainer, { flexWrap: 'wrap' }]}
                    onPress={handleNavigation}>
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
      ) : (
        <VerificationCodeInput />
      )}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '5%',
  },
  background: {
    // justifyContent: "center",
    // alignItems: "center",
    height: '100%',
    backgroundColor: SCREEN_BACKGROUND_COLOR,
  },
  carousel: {
    // width: GRIDSET_HEADER_SIZE,
    top: 65,
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
    fontWeight: 'bold',
    textAlign: 'center',
    // fontFamily: 'Courier New'
    fontFamily: MAIN_FONT_FAMILY,
    // fontFamily: "Spectral"
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

const verticalReelStyles = (expanded, expandedGridset) =>
  StyleSheet.create({
    backgroundColor: SCREEN_BACKGROUND_COLOR,
    paddingTop: 120,
    paddingBottom: 60,
    minHeight: expanded
      ? expandedGridset.current.length * (GRID_CONTAINER_SIZE + 10)
      : GRID_CONTAINER_SIZE,
    // justifyContent: "space-between",
    gap: 90,
    alignItems: 'center',
  });

Home.displayName = 'Home';
export default Home;

// 3. enabled copy and pasting entire code into all 6 boxes at once
