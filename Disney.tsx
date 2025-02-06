  /* eslint-disable react-native/no-inline-styles */
import {StyleSheet, View, ViewToken, useWindowDimensions} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {movies} from './src/data/movies';
import Animated, {
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import BackImage from './src/components/BackImage';
import RenderItem from './src/components/RenderItem';
import Gradient from './src/components/Gradient';
import WatchNowButton from './src/components/WatchNowButton';
import PlusButton from './src/components/PlusButton';
import TextInfo from './src/components/TextInfo';
import Pagination from './src/components/Pagination';
import {SystemBars} from 'react-native-bars';

// install everything and get this running locally and then I can decide if I
    // add and remove things to see what breaks & changes
    // ask chat gpt
// I don't want the grids or the grid squares to be flatlist because I want to render them all at once and I don't want them scrollable 
// updating shared values are not causes for re-renders, which makes sense because the animation is going to use it and change the state of rendering anyways


// how is rerendering being applied first Social card?
// how is rerendering being applied for other cards?
    // --? the animations are probably applying on the cards (derivedValue) just as the Flashlist data gets updated and re-rerenders, causes the frames and animations to drop out
    // --? moving to data.maps() will probably fix this
// what are all the conditions that rerendering occurs in?
    // when do flatlists cause rerendering?
    // when do state values cause rerendering?
    // when do ref values not rerender?
// how do I make a grid with data.map()? 
    // --? make it so square fit in container and then flex wrap
    // --? or container{flexDirection:column} > row containers

const CarouselDisneyScreen = () => {
  const x = useSharedValue(0);
  const [data, setData] = useState(movies);
  const {width} = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paginationIndex, setPaginationIndex] = useState(0);
  const ref = useAnimatedRef<Animated.FlatList<any>>();
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  // does useState values persist across re-renders and cause re-renders, or do they not persist?
    // if one useState causes the update of another useState, does this cause a re-render?
    // is this the benefit of useRef? that a state can update another
  // wtf does this mean
    // useRef is used here because it persists across re-renders without causing re-renders.
    // Allows clearInterval(interval.current) to stop auto-play even after multiple renders.
  // why is this a reference? 
  // what happens if this is not a reference?
  // it gets re-rendered on every update? but seeig
  const interval = useRef<NodeJS.Timeout>();
  const offset = useSharedValue(0);

  // how is onViewableItemsChanged being called?
  // how is viewableItems being passed in?
  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    // why is this conditional here?
    if (
      viewableItems[0].index !== undefined &&
      viewableItems[0].index !== null
    ) {
      setCurrentIndex(viewableItems[0].index);
      setPaginationIndex(viewableItems[0].index % movies.length);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };
  // when is viewabilityConfig being used?
  const viewabilityConfigCallbackPairs = useRef([
    {viewabilityConfig, onViewableItemsChanged},
  ]);
  // do flatlists come with other scroll props?
    // --? paging, snap
  // how is x used in BackImage and TextInfo?
  // what is the animation being applied with this animatedScrollHandler?
    // what is offset.value offsetting?
  // what is the difference use onMomentumEnd instead of withSpring()?
    // --? onMomentumEnd and useAnimatedScrollHandler is probably optimised for scrolling
  const onScroll = useAnimatedScrollHandler({
    onScroll: e => {
      x.value = e.contentOffset.x;
    },
    onMomentumEnd: e => {
      offset.value = e.contentOffset.x;
    },
  });

  // doesn't this need a variable assignment?
  // how is it being called?
  useDerivedValue(() => {
    scrollTo(ref, offset.value, 0, true);
  });

  // why interval.current and not just interval?
  // why are we returning a function?
  useEffect(() => {
    if (isAutoPlay === true) {
      interval.current = setInterval(() => {
        offset.value = offset.value + width;
      }, 4000);
    } else {
      clearInterval(interval.current);
    }
    return () => {
      clearInterval(interval.current);
    };
  }, [isAutoPlay, offset, width]);

  return (
    <View style={styles.container}>
      <SystemBars animated={true} barStyle={'light-content'} />

      {/* why map through the entire data set opposed to <TextInfo item={data[currentIndex]} */}
      {/* why is View outside of the conditional? --? maintin spacing? */}
      {data.map((item, index) => {
        return (
          <View key={index}>
            {currentIndex === index && (
              <BackImage index={index} item={item} x={x} />
            )}
          </View>
        );
      })}
      <Gradient />
      {/* is the animated flatlist for the scrolling? */}
      {/* what happens if I just use a normal flatlist? */}
      {/* what are the other animations applied to flatlists that make Animated. more optimized? */}
      {/* I would still love to know how scrollTo is being called and thus ref used */}
      {/* why is flexGrow: 0 */}
      {/* whats the default scrollEventThrottle? */}
      <Animated.FlatList
        ref={ref}
        style={{height: width, flexGrow: 0}}
        onScrollBeginDrag={() => {
          setIsAutoPlay(false);
        }}
        onScrollEndDrag={() => {
          setIsAutoPlay(true);
        }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        horizontal={true}
        bounces={false}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        // does this create an infinitely expanding window width?
            // what impact does this have on performance, if any?
        // does this mean that there is a finite start point? --? scrolling won't prepend movies
        onEndReached={() => setData([...data, ...movies])}
        onEndReachedThreshold={0.5}
        data={data}
        // why is this not applied dynamically if we only need to return 'index
        keyExtractor={(_, index) => `list_item${index}`}
        renderItem={({item, index}) => {
          return <RenderItem item={item} index={index} x={x} />;
        }}
      />
      {/* won't the key here be the same as the background images? */}
      {data.map((item, index) => {
        return (
          <View key={index}>
            {currentIndex === index && (
              <TextInfo item={item} index={index} x={x} />
            )}
          </View>
        );
      })}
      <View style={styles.buttonContainer}>
        <WatchNowButton />
        <PlusButton />
      </View>
      <Pagination paginationIndex={paginationIndex} />
    </View>
  );
};

export default CarouselDisneyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1014',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
});