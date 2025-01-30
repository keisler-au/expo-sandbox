import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const Profile = () => {
  const navigation = useNavigation();
  return(
    <>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Ionicons name="home-outline" size={30} color="black" />
      </TouchableOpacity>
    </>
  )
}


const styles = StyleSheet.create({

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: "green",
    color: "gold",
  },
});


export default Profile;