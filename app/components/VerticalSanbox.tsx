import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, UIManager, Platform } from 'react-native';

import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import GridDataProvider from "./GridDataProvider";
import TemplateGrid from "./GridTypes";
import { GRID_CONTAINER_GAP, GRID_CONTAINER_SIZE } from "./GridLayout";
import Grid from "./GridLayout";

import bingoGames from "../templateFixtures";


// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const cards = ['Card 1', 'Card 2', 'Card 3', 'Card 4', 'Card 5'];

const CardStackAnimation = () => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpansion = () => {
    LayoutAnimation.easeInEaseOut(); // Smooth transition
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      {bingoGames.map((item, index) => {
        const topOffset = expanded ? index * 80 : index * -10; // Stacked vs expanded position

        return (
        //               <TouchableOpacity
        //     key={index}
        //     style={[styles.card, { top: topOffset, zIndex: cards.length - index }]}
        //     onPress={toggleExpansion}
        //   >
        //     <Text style={styles.cardText}>{card}</Text>
        //   </TouchableOpacity>
            <GridDataProvider initialGridData={item} cardId={1}>
                <TouchableOpacity onPress={toggleExpansion} style={[styles.card, { top: topOffset, zIndex: cards.length - index }]}>
                {/* <Animated.View style={[styles.card, { top: topOffset, zIndex: cards.length - index }]}> */}
                    <Grid gridType="template" onSquarePress={()=>{}} />
                {/* </Animated.View> */}
                </TouchableOpacity>
            </GridDataProvider>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    position: 'absolute',
    width: 200,
    height: 100,
    backgroundColor: '#007BFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  cardText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CardStackAnimation;
