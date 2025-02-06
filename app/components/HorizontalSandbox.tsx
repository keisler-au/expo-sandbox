import React, { useRef, useState, useEffect } from "react";
import { View, Text, FlatList, Dimensions, Animated } from "react-native";

const { width } = Dimensions.get("window");

const data = [
  { id: "1", color: "red" },
  { id: "2", color: "blue" },
  { id: "3", color: "green" },
];

// Duplicate data to create an infinite loop illusion
const infiniteData = [...data, ...data];

const Carousel = () => {
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = (index + 1) % data.length;
      setIndex(nextIndex);
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * width,
        animated: true,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [index]);

  return (
    <FlatList
      ref={flatListRef}
      data={data}
      keyExtractor={(item) => item.id + Math.random()}
      horizontal
      pagingEnabled
      // scrollEnabled={false} // Prevent manual scrolling
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <View style={{ width, height: 200, backgroundColor: item.color, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 24, color: "#fff" }}>{item.id}</Text>
        </View>
      )}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: false }
      )}
    />
  );
};

export default Carousel;
