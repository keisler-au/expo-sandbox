import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

interface IconHeaderProps {
  icons: {
    type: string;
    path: string;
  }[];
  onPress?: Function;
}
const IconHeader = ({ icons, onPress }: IconHeaderProps) => {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.navBar}>
      {icons.map((icon) => (
        <TouchableOpacity
          onPress={() =>
            typeof onPress === "function"
              ? onPress()
              : navigation.navigate(icon.path)
          }
        >
          <Ionicons name={icon.type} size={30} />
        </TouchableOpacity>
      ))}
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
