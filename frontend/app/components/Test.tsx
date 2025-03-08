import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,

  StyleSheet,
  Dimensions,
  TouchableOpacity
} from "react-native";
import Animated, { Extrapolation,  interpolate, runOnJS, useAnimatedScrollHandler, useSharedValue, useAnimatedRef, useAnimatedStyle, scrollTo, useDerivedValue } from "react-native-reanimated";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.5;
const CARD_HEIGHT = 200;
const SPACING = 10;
const SIDE_CARD_WIDTH = width * 0.4;
const BOX_NUM = 3;
const MAIN_FONT_FAMILY = 'Verdana';
const TOTL_C_WDTH = CARD_WIDTH + (SPACING * 2);

// Original data (will be duplicated)
const oD = [1,2,3,4]
const originalData = Array(250).fill(oD).flat();// 5 items
// const data = [...originalData, ...originalData]; // Duplicate to create seamless loop

const GridTemplate = () => (
  Array.from({ length: BOX_NUM }).map((_, rowIndex) => (
    <View key={rowIndex} style={styles.gridsetHeaderRow}>
      {Array.from({ length: BOX_NUM }).map((_, colIndex) => (
        <View key={colIndex} style={styles.gridsetHeaderSquare} />
      ))}
    </View>
  ))
)

const GridContainer = ({item, index, scrollX}) => {

    const rnAnimatedStyle = useAnimatedStyle(() => {
        const getInput = (i:number) => i * CARD_WIDTH - (width - CARD_WIDTH) / 2
        const inputRange = [getInput(index-1), getInput(index), getInput(index+1)];

        if (index >= 499 && index <= 501) {
          console.log('_____________________________________')
          console.log('index = ', index)
          console.log('scollx = ', scrollX.value)
          console.log('IR = ', inputRange)
          console.log('_____________________________________')
        }

        return {
            transform: [
                {
                    translateX: interpolate(
                        // input value that references the start and end points of the translation
                        scrollX.value,
                        // container width points
                        inputRange,
                        // how to manipulate the scrollX.value for each container width point
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

                // This directly negates the upward movement caused by scale ^
                { 
                  translateY: interpolate(
                      scrollX.value,
                      inputRange,
                      [0, 76, 0],
                      Extrapolation.CLAMP
                    )
                },
                // {
                //     rotateY: `${interpolate(
                //           scrollX.value,
                //           inputRange,
                //           [60, 0, -60],
                //           Extrapolation.CLAMP
                //       )}deg`
                // }
            ]
        }
    })
    return (
        <Animated.View style={rnAnimatedStyle}>
        <TouchableOpacity
        // onPress={() => isVerticalReel(item)}
        activeOpacity={1}
        style={styles.gridsetHeader}
        >
        {/* <GridsetHeaderBackground /> */}
        <GridTemplate />
        <View style={styles.gridsetHeaderLabelContainer}>
            <Text style={styles.gridsetHeaderLabel}>{item}</Text>
        </View>
        </TouchableOpacity>
    </Animated.View>
    )
}


const Carousel = () => {
    const [data, setData] = useState(originalData);
    const scrollX = useSharedValue(0);
    const flatListRef = useRef(null);
    const scrollViewRef = useAnimatedRef();

    const onScrollHandler = useAnimatedScrollHandler({
            onScroll: (e) => {
                scrollX.value = e.contentOffset.x;
                const totalWidth = data.length * CARD_WIDTH;
                const threshold = CARD_WIDTH * 3;

                if (totalWidth - (scrollX.value + width) <= threshold) {
                    runOnJS(setData)([...data, ...oD]);
                }
 
                // if (e.contentOffset.x <= threshold) {

                // }
            },
        });

    const renderGridsetHeader = ({ item, index }) => 
        <GridContainer item={item} index={index} scrollX={scrollX} />

    return (
        <Animated.FlatList
            ref={flatListRef}
            data={data}
            style={styles.carousel}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            onScroll={onScrollHandler}
            renderItem={renderGridsetHeader}
            decelerationRate="fast"
            snapToAlignment="center"
            snapToInterval={CARD_WIDTH}
            initialScrollIndex={originalData.length / 2} 
            getItemLayout={(data, index) => ({
                length: CARD_WIDTH, // Width of each item
                offset: (CARD_WIDTH) * index - (width - (CARD_WIDTH)) / 2,
                index,
            })}
            // contentContainerStyle={{justifyContent:"center"}}
        />
    );
};

export default Carousel;



const styles = StyleSheet.create({
  background: {
    height: '100%',
    // backgroundColor: SCREEN_BACKGROUND_COLOR,
    position: "relative",
  },
  carousel: {
    marginTop: 120,

    width: width,
    // top: 110,
    // top: 65,

  },
  gridsetHeader: {

    width: CARD_WIDTH,


    alignItems: 'center',

  },
  gridsetHeaderRow: {

    flexDirection: 'row',
  },
  gridsetHeaderSquare: {
    margin: "5%",
    width: CARD_WIDTH/BOX_NUM * 0.9,
    height: CARD_WIDTH/BOX_NUM * 0.9,
    borderWidth: 1,
    // flex: 1,
    // margin: 10,
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