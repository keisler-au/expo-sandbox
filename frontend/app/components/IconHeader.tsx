import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const IconHeader = ({ type, paths, onPress = undefined }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.navBar}>
      <TouchableOpacity onPress={() => navigation.navigate(paths[0])}>
        <Ionicons name={type[0]} size={30} />
      </TouchableOpacity>
      {type[1] && (
        <TouchableOpacity onPress={onPress}>
          <Ionicons name={type[1]} size={30} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    position: "absolute",
    top: 0,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    padding: "5%",
  },
});

export default IconHeader;
