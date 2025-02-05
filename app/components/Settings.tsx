import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Settings = () => {
  const navigation = useNavigation();
  return(
    <SafeAreaView>
  <TouchableOpacity onPress={() => navigation.navigate("Home")}>
    <Ionicons name="home-outline" size={30} color="black" />
  </TouchableOpacity>
  </SafeAreaView>
)}


const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: "blue",
    color: "white",
  },
});


export default Settings;