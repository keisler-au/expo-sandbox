import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
} from "react-native";
import useWebSocket from "react-use-websocket";
import IconHeader from "./IconHeader";
import { Feather, Ionicons } from "@expo/vector-icons";
// @ts-ignore
import BottomSheet from "react-native-simple-bottom-sheet";
import { useNetInfo } from "@react-native-community/netinfo";
// @ts-ignore
import { isEqual } from "lodash";
import { WEBSOCKET_UPDATES_URL } from "../constants";
import { Game, Player, Task as Square } from "../types";
import {
  saveGameToStorage,
  saveToQueue,
  sendSavedQueue,
  updateGame,
  verifyEarliestCompletedSquare,
} from "../utils/gameActions";

const webSocketConfig = {
  // TODO: TESTING
  // 1. Unit test
  // 2. Increases risk that local updates will permanently fail to send
  heartbeat: {
    message: "heartbeat",
    returnMessage: "thump",
    timeout: 60000, // 1 minute, if no response received, the connection is closed
    interval: 25000, // every 25 seconds a ping message will be sent
  },
  reconnectAttempts: 15,
  shouldReconnect: () => true,
  reconnectInterval: (attempt: number) =>
    Math.min(Math.pow(2, attempt) * 1000, 10000),
  onOpen: () => console.log("WebSocket connected"),
  onClose: (event: any) =>
    console.log(`WebSocket closed: ${event.reason}, reconnecting...`),
};

interface PlayProp {
  route: {
    params: {
      game: Game;
      player: Player;
    };
  };
}
const Play = ({ route }: PlayProp) => {
  const [game, setGame] = useState(route.params.game.tasks);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTask, setModalTask] = useState<Square | null>(null);
  const [completedSquare, setCompletedSquare] = useState<Square | null>(null);
  const player = route.params.player;
  const rows = game.length;
  const cols = game[0].length;
  const netInfo = useNetInfo();
  const isOffline = !netInfo.isConnected;

  const { sendJsonMessage, lastJsonMessage } = useWebSocket<{ data: any }>(
    `${WEBSOCKET_UPDATES_URL}/${route.params.game.id}/`,
    webSocketConfig,
  );

  // Receive remote update
  // TODO: TESTING
  // 1. Unit test
  // 2. Earlier completed remote updates won't be applied
  useEffect(() => {
    const recievedSquare = lastJsonMessage?.data?.task;
    if (recievedSquare && recievedSquare.completed_by.id !== player.id) {
      const earliestSquare = verifyEarliestCompletedSquare(
        recievedSquare,
        game[recievedSquare.grid_row][recievedSquare.grid_column],
      );
      if (isEqual(recievedSquare, earliestSquare)) {
        const updatedGame = updateGame(recievedSquare, player.id, game);
        setGame(updatedGame);
        saveGameToStorage({ ...route.params.game, tasks: updatedGame });
      }
    }
  }, [lastJsonMessage, game, player.id, route.params.game]);

  // Send or Queue local update
  // TODO: TESTING
  // 1. Unit test
  // 2. Offline updates not saved OR sent, Online updates not sent, Offline game not saved
  useEffect(() => {
    if (isOffline === null) return;
    if (isOffline && completedSquare) {
      saveToQueue(completedSquare);
      setCompletedSquare(null);
    } else if (completedSquare) {
      sendJsonMessage(completedSquare);
      setCompletedSquare(null);
    } else if (isOffline) {
      saveGameToStorage({ ...route.params.game, tasks: game });
    } else {
      sendSavedQueue(sendJsonMessage);
    }
  }, [isOffline, completedSquare, sendJsonMessage, game, route.params.game]);

  const shareContent = async () =>
    await Share.share({ message: route.params.game.code });

  // TODO: TESTING
  // 1. Unit test
  // 2. Local task update won't be sent or saved
  const taskCompleted = async (square: Square) => {
    const currentSquare = game[square.grid_row][square.grid_column];
    const earliestSquare = verifyEarliestCompletedSquare(square, currentSquare);
    if (isEqual(square, earliestSquare)) {
      square = { ...square, completed: true, completed_by: player };
      const updatedGame = updateGame(square, player.id, game);
      setGame(updatedGame);
      saveGameToStorage({ ...route.params.game, tasks: updatedGame });
      setCompletedSquare(square);
    }
    setModalVisible(false);
  };

  const taskDisplayChange = (square: Square) => {
    square.completed && setGame(updateGame(square, player.id, game));
    setModalTask(square);
    setModalVisible(!square.completed);
  };

  return (
    <View style={styles.screenContainer}>
      <IconHeader icons={[{ type: "home-outline", path: "Home" }]} />
      <Text style={styles.gameCode}>Game Code</Text>
      <View style={styles.shareContainer}>
        <Text style={styles.code}>{route.params.game.code}</Text>
        <Feather name="share" onPress={shareContent} size={25} />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          {route.params.game.title || `Game${route.params.game.code}`}
        </Text>
      </View>
      <View style={styles.gridContainer}>
        {game.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.gridRow}>
            {row.map((square, colIndex) => {
              return (
                <View
                  key={colIndex + rowIndex}
                  style={[
                    styles.squareContainer,
                    {
                      height: rows === cols ? 350 / rows : 280 / rows,
                      width: 350 / cols,
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={completeTaskStyles(square.completed).innerSquare}
                    onPress={() => taskDisplayChange(square)}
                  >
                    <Text style={[styles.gridText]}>
                      {square.completed && square.displayText
                        ? square.displayText
                        : square.value}
                    </Text>
                  </TouchableOpacity>
                  <Modal
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                  >
                    <View style={styles.modalContainer}>
                      <View style={styles.modalContent}>
                        <TouchableOpacity
                          style={styles.closeCross}
                          onPress={() => setModalVisible(false)}
                        >
                          <Ionicons name="close-outline" size={35} />
                        </TouchableOpacity>
                        <View style={styles.modalDescriptionTextContainer}>
                          <Text style={styles.modalDescriptionText}>
                            {modalTask?.value}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.modalCompletedContainer}
                          onPress={() => modalTask && taskCompleted(modalTask)}
                        >
                          <Text style={styles.modalCompletedText}>
                            Completed
                          </Text>
                          <Feather
                            name="check-square"
                            size={25}
                            color="green"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                </View>
              );
            })}
          </View>
        ))}
      </View>

      <BottomSheet
        isOpen={false}
        sliderMinHeight={40}
        wrapperStyle={{
          shadowOpacity: 1,
          shadowColor: "#ffffff",
          shadowRadius: 1,
          shadowOffset: { width: 0, height: -5 },
        }}
        outerContentStyle={{ backgroundColor: "#ffffff" }}
      >
        <View style={styles.users}>
          {route.params.game.players.map((player) => (
            <View key={player.id} style={styles.profileContainer}>
              <Ionicons name="person-circle-outline" size={20} />
              <Text>{player.name}</Text>
            </View>
          ))}
        </View>
      </BottomSheet>
    </View>
  );
};

export default Play;

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
  screenContainer: {
    alignItems: "center",
    height: "100%",
  },
  gameCode: {
    fontWeight: "bold",
    fontSize: 22,
    marginTop: 100,
  },
  shareContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    marginTop: 10,
  },
  code: {
    marginTop: 5,
    letterSpacing: 4,
    fontSize: 25,
  },
  titleContainer: {
    marginTop: 60,
    height: 25,
    flexDirection: "row",
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderLeftColor: "transparent",
    // borderBottomColor: "black",
    borderWidth: 2,
  },
  title: {
    marginBottom: 2,
    fontSize: 18,
    textAlign: "center",
  },
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    height: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  closeCross: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: 10,
  },
  modalDescriptionTextContainer: {
    justifyContent: "center",
    height: "75%",
    width: "80%",
  },
  modalDescriptionText: {
    fontSize: 30,
    textAlign: "center",
  },
  modalCompletedContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 5,
    padding: 10,
    gap: 8,
  },
  modalCompletedText: {
    fontSize: 25,
    color: "green",
  },
  users: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    paddingBottom: 20,
    paddingLeft: 20,
  },
  profileContainer: {
    flexDirection: "row",
    gap: 10,
  },
});
