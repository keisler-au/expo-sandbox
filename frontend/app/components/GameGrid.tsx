import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Task as Square } from "../types";
import CompleteTaskModal from "./CompleteTaskModal";

interface GridProps {
  game: Square[][];
  onDisplayChange: Function;
  onComplete: Function;
}
const GameGrid = ({ game, onDisplayChange, onComplete }: GridProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTask, setModalTask] = useState<Square | null>(null);
  const polygonHeight =
    (game.length === game[0].length ? 350 : 280) / game.length;
  const polygonWidth = 350 / game[0].length;
  // console.log("GAME = ", game[4]);
  return (
    <View style={styles.gridContainer}>
      {game.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.gridRow}>
          {row.map((square, colIndex) => {
            // console.log("square = ", square);
            return (
              <View
                key={colIndex + rowIndex}
                style={[
                  styles.squareContainer,
                  { height: polygonHeight, width: polygonWidth },
                ]}
              >
                <TouchableOpacity
                  style={completeTaskStyles(square.completed).innerSquare}
                  onPress={() => {
                    if (square.completed) onDisplayChange(square);
                    else {
                      setModalVisible(true);
                      setModalTask(square);
                    }
                  }}
                >
                  <Text style={[styles.gridText]}>
                    {square.completed && square.displayText
                      ? square.displayText
                      : square.value}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      ))}
      <CompleteTaskModal
        modalVisible={modalVisible}
        modalTask={modalTask}
        onComplete={() => {
          setModalVisible(false);
          onComplete(modalTask);
        }}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default GameGrid;

const completeTaskStyles = (completed: boolean) =>
  StyleSheet.create({
    innerSquare: {
      width: completed ? "100%" : "80%",
      height: completed ? "100%" : "80%",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: completed ? 0 : 1,
      borderStyle: "solid",
      borderColor: "black",
      elevation: 10,
      shadowOpacity: 0.2,
      shadowRadius: completed ? 0 : 1,
      shadowOffset: { width: 0, height: completed ? 0 : 4 },
      backgroundColor: completed ? "#e0e0e0" : "#ffffff",
    },
  });

const styles = StyleSheet.create({
  gridContainer: {
    marginTop: 45,
    borderWidth: 0.5,
    borderStyle: "solid",
    borderColor: "black",
  },
  gridRow: {
    flexDirection: "row",
  },
  squareContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderStyle: "solid",
    borderColor: "black",
    display: "flex",
  },
  gridText: {
    fontSize: 10,
    textAlign: "center",
  },
});
