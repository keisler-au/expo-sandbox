import React, { useState, useEffect, useRef } from "react";
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
import { URLS } from "../constants";
import { Game, Player, Task as Square } from "../types";
import {
  saveGameToStorage,
  saveToQueue,
  sendSavedQueue,
  updateGame,
  verifyEarliestCompletedSquare,
} from "../utils/gameActions";
import FailedConnectionModal from "./FailedConnectionModal";
import RequestService from "../services";
import GameGrid from "./GameGrid";
import { useFocusEffect } from "@react-navigation/native";

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
  shouldReconnect: (_: any) => true,
  retryOnError: true,
  reconnectInterval: (attempt: number) =>
    Math.min(Math.pow(2, attempt) * 1000, 12000),
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
  const [completedSquare, setCompletedSquare] = useState<Square | null>(null);
  const [errorModal, setErrorModal] = useState<string | false>(false);
  const player = route.params.player;

  const netInfo = useNetInfo();
  const isOffline = !netInfo.isConnected;
  // console.log("PLAY");
  const { sendJsonMessage, lastJsonMessage, getWebSocket } = useWebSocket<{
    data: any;
  }>(`${URLS.WEBSOCKET_UPDATES_URL}/${route.params.game.id}/`, {
    onReconnectStop: () => setErrorModal(RequestService.WEBSOCKET_FAILURE),
    filter: (message) =>
      message?.data?.task && message.data.task.completed_by.id !== player.id,
    ...webSocketConfig,
  });

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        const socket = getWebSocket();
        socket && socket.close();
      };
    }, []),
  );

  // Receive remote update
  // TODO: TESTING
  // 1. Unit test
  // 2. Earlier completed remote updates won't be applied
  useEffect(() => {
    // console.log("Recieving....");
    if (lastJsonMessage?.data) {
      const recievedSquare = lastJsonMessage.data.task;
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
    // console.log("Sending....");
    if (isOffline === null) return;
    if (isOffline && completedSquare) {
      // console.log("1");
      saveToQueue(completedSquare);
      setCompletedSquare(null);
    } else if (completedSquare) {
      // console.log("2");
      sendJsonMessage(completedSquare);
      setCompletedSquare(null);
    } else if (isOffline) {
      // console.log("3");
      saveGameToStorage({ ...route.params.game, tasks: game });
    } else {
      // console.log("4");
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
    // setCompletedModal(false);
  };

  const taskDisplayChange = (square: Square) => {
    setGame(updateGame(square, player.id, game));
    // setModalTask(square);
    // setCompletedModal(!square.completed);
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
      <GameGrid
        game={game}
        onComplete={taskCompleted}
        onDisplayChange={taskDisplayChange}
      />

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
      <FailedConnectionModal
        displayModal={!!errorModal}
        message={errorModal}
        onClose={() => setErrorModal(false)}
      />
    </View>
  );
};

export default Play;

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
    // flexDirection: "row",
    // borderTopColor: "transparent",
    // borderRightColor: "transparent",
    // borderLeftColor: "transparent",
    // borderBottomColor: "black",
    // borderWidth: 2,
  },
  title: {
    marginBottom: 2,
    fontSize: 18,
    textAlign: "center",
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
