import React, { useState, useRef, memo } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Carousel from './Carousel';
import CreatePlayerModal from './CreateProfileModal';
import IconHeader from './IconHeader';
import JoinGameInput from './Join';
import VerticalReel from './VerticalReel';

import bingoGames from '../templateFixtures';


const Home = memo(() => {
  const [expanded, setExpanded] = useState(false);
  const [playerModal, setPlayerModal] = useState(false);
  const expandedGridset = useRef();

  const isVerticalReel = (gridset) => {
    expandedGridset.current = bingoGames[gridset];
    setExpanded(!expanded);
  };

  return (
    <SafeAreaView style={styles.background}>
      <IconHeader 
        type={["settings-outline", "person-circle-outline"]} 
        paths={["Settings", "Profile"]}
        onPress={() => setPlayerModal(true)}
      />
      <Carousel isVerticalReel={isVerticalReel}/>
      {expanded 
        ? <VerticalReel 
          collapseReel={isVerticalReel} 
          expandedGridset={expandedGridset}
        /> 
        : <JoinGameInput joinGameVisible={!expanded} />}
      <CreatePlayerModal displayModal={playerModal} onClose={() => setPlayerModal(false)} />
    </SafeAreaView>

  );
});

const styles = StyleSheet.create({
  background: {
    height: '100%',
    position: "relative",
  },
});


export default Home;
