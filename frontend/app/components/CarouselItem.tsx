
import React from "react";
import { Dimensions, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, { Extrapolation,  interpolate, useAnimatedStyle } from "react-native-reanimated";


const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.5;
const BOX_NUM = 3;

const CarouselItem = ({ item, index, scrollX, isVerticalReel}) => {
    const rnAnimatedStyle = useAnimatedStyle(() => {
        const getInput = (i:number) => i * CARD_WIDTH - (width - CARD_WIDTH) / 2
        const inputRange = [getInput(index-1), getInput(index), getInput(index+1)];
        return {
            transform: [
                {
                    translateX: interpolate(
                        scrollX.value,
                        inputRange,
                        [40, 0, -40],
                        Extrapolation.CLAMP
                    )
                },
                {
                  scale: interpolate(
                        scrollX.value,
                        inputRange,
                        [0.7, 1.1, 0.7],
                        Extrapolation.CLAMP
                    ),
                },
                { 
                  translateY: interpolate(
                      scrollX.value,
                      inputRange,
                      [0, 1, 0],
                      Extrapolation.CLAMP
                    )
                },
            ]
        }
    })

    return (
          <TouchableOpacity
            onPress={() => isVerticalReel(item)}
            activeOpacity={1}
            style={styles.grid}
          >
          <Animated.View style={[rnAnimatedStyle, styles.gridAnimate]}>
            {Array.from({ length: BOX_NUM }).map((_, rowIndex) => (
                <View key={rowIndex} style={styles.gridRow}>
                    {Array.from({ length: BOX_NUM }).map((_, colIndex) => (
                    <View key={colIndex} style={styles.gridSquare} />
                    ))}
                </View>
            ))}
            <View style={styles.gridTextContainer}>
                <Text style={styles.gridText}>{item}</Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
    )
}

export default CarouselItem;

const MAIN_FONT_FAMILY = 'Verdana';
const styles = StyleSheet.create({
  grid: {
    width: CARD_WIDTH,
    zIndex: 50,
  },
  gridAnimate: {
    alignItems: "center",
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridSquare: {
    margin: "5%",
    width: CARD_WIDTH / BOX_NUM * 0.9,
    height: CARD_WIDTH / BOX_NUM * 0.9,
    borderWidth: 1,
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
    shadowOffset: { width: 0, height: 4 },
    opacity: 0.5,
    borderRadius: 5,
  },
  gridTextContainer: {
    top: "30%",
    bottom: "30%",
    position: 'absolute',
    justifyContent: 'center',
  },
  gridText: {
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: MAIN_FONT_FAMILY,
  },
});