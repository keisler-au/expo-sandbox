import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import HorizontalSandbox from './HorizontalSandbox';
import VerticalCards from "./VerticalCards"
import GridDataProvider  from './GridDataProvider';
import TemplateGrid  from './GridTypes';
import CarouselAndGridExpansion from './CarouselAndGridExpansion';
import CarouselSandbox from './HorizontalSandbox';
import CardStackAnimation from './VerticalSanbox';

// const initialGridData = [    
//     ['B1', 'B2', 'B3', 'B4', 'B5'],
//     ['I1', 'I2', 'I3', 'I4', 'I5'],
//     ['N1', 'N2', 'N3', 'N4', 'N5'],
//     ['G1', 'G2', 'G3', 'G4', 'G5'],
//     ['O1', 'O2', 'O3', 'O4', 'O5']
// ];


const Home = () => {
  // const navigation = useNavigation();
  // navigation.setOptions({ headerShown: false });

  return (
    <>
      {/* <View style={styles.header}>``
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person-circle-outline" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Ionicons name="settings-outline" size={30} color="black" />
        </TouchableOpacity>
      </View> */}
      {/* <HorizontalSandbox /> */}
      <VerticalCards />
      {/* <GridDataProvider initialGridData={initialGridData} cardId={1}>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <TemplateGrid/>
        </TouchableOpacity>
      </GridDataProvider> */}
      {/* <CarouselAndGridExpansion /> */}
      {/* <CarouselSandbox /> */}
      {/* <CardStackAnimation /> */}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: "5%",
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
  },
});

export default Home;
