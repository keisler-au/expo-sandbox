import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';


const SCREEN_TEXT_COLOR = 'rgb(212, 175, 55)';

const IconHeader = ({type, paths}) => {
  const navigation = useNavigation();
  return ( 
    <View style={styles.navBar}>
      <TouchableOpacity onPress={() => navigation.navigate(paths[0])}>
        <Ionicons
          name={type[0]}
          size={30}
          color={SCREEN_TEXT_COLOR}
        />
      </TouchableOpacity>
      {type[1] && <TouchableOpacity onPress={() => navigation.navigate(paths[1])}>
        <Ionicons
          name={type[1]}
          size={30}
          color={SCREEN_TEXT_COLOR}
        />
      </TouchableOpacity>}
    </View>
  )
}

const styles = StyleSheet.create({
    navBar: {
        position: "absolute",
        top: 0,
        flexDirection: 'row',
        width: "100%",
        justifyContent: 'space-between',
        padding: '5%',
  }
})

export default IconHeader;