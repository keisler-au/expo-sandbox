import React, { useState } from "react";
import { Dimensions, StyleSheet, FlatList, TouchableOpacity, Text, Pressable} from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import GridDataProvider from "./GridDataProvider";
import TemplateGrid from "./GridTypes";
import { GRID_CONTAINER_GAP, GRID_CONTAINER_SIZE } from "./GridLayout";
import Grid from "./GridLayout";

import bingoGames from "../templateFixtures";

import Carousel from 'react-native-reanimated-carousel';


const VerticalCards = () => { 
  const [expanded, setExpanded] = useState(false);
  const navigation = useNavigation();
  const width = Dimensions.get('window').width;

  const initialOffsets = index => index < 2 ? (index * 5) : 10
  const expandedOffsets = bingoGames.map((_, index) => useSharedValue(initialOffsets(index)));

  const animatedStyles = bingoGames.map((_, index) => {
    return useAnimatedStyle(() => ({
      transform: [
        { 
          translateY: expandedOffsets[index].value
        }
      ]
    }));
  });

  const handleExpand = () => {
    if (!expanded) {
      bingoGames.forEach((_, index) => {
        expandedOffsets[index].value = withTiming(
          index * (GRID_CONTAINER_SIZE + GRID_CONTAINER_GAP), { duration: 500 }
        );
      });
      setExpanded(true);
    }
    if (expanded) {
      navigation.navigate("Profile")
    }
  };

  const handleCollapse = () => {
    if (expanded) {
      bingoGames.forEach((_, index) => {
        expandedOffsets[index].value = withTiming(initialOffsets(index), { duration: 500 });
      });
      setExpanded(false);
    }
  };
  console.log(expanded)
  return (
    <Carousel
      loop
      width={width}
      height={width / 2}
      style={{flex: 1}}
      autoPlay={!expanded}
      data={[...new Array(6).keys()]}
      scrollAnimationDuration={1500}
      windowSize={2}
      panGestureHandlerProps={{
        activeOffsetX: expanded ? [-9999, 9999] : [-10, 10]
      }}
      renderItem={({ index }) => (
        <Pressable style={styles(expanded).fullScreen} onPress={handleCollapse}>
          <FlatList
            data={bingoGames}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles(expanded).container}
            initialNumToRender={3}
            maxToRenderPerBatch={2}
            updateCellsBatchingPeriod={1000} 
            renderItem={({item, index}) => (
              <GridDataProvider initialGridData={item} cardId={1}>
                <TouchableOpacity 
                  activeOpacity={expanded ? 0.2 : 1}
                  onPress={handleExpand} 
                  style={{ zIndex: (bingoGames.length - index) }}
                >
                  <Animated.View style={[styles().card, animatedStyles[index]]}>
                    <Grid gridType="template" onSquarePress={()=>{}} />
                  </Animated.View>
                </TouchableOpacity>
              </GridDataProvider>
            )}
          />
        </Pressable>
      )}
    />
  );
};

const styles = (expanded=null) => StyleSheet.create({
  fullScreen: { minHeight: "100%"},
  container: { 
    height: (
      expanded 
        ? bingoGames.length * (GRID_CONTAINER_SIZE + GRID_CONTAINER_GAP)  
        : GRID_CONTAINER_SIZE
    ),
  },
  card: {
    position: "absolute",
    width: GRID_CONTAINER_SIZE,
    height: GRID_CONTAINER_SIZE,
    alignSelf: "center",
  },
});

export default VerticalCards;
