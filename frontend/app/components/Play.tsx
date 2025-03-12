import React, {useState, useEffect, useRef} from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Share} from 'react-native';
import useWebSocket from 'react-use-websocket';
// import {shareAsync} from 'expo-sharing';
import IconHeader from "./IconHeader"
import { Feather, Ionicons } from '@expo/vector-icons';
import BottomSheet from 'react-native-simple-bottom-sheet';
import NetInfo, { refresh } from '@react-native-community/netinfo';
import { getItemAsync, setItemAsync, deleteItemAsync } from 'expo-secure-store';

import { isEqual } from 'lodash';
import { STORAGE_KEYS, RECIEVE_GAME_UPDATES_URL } from '../constants';






const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}

// TODO: TESTING
// 1. Unit test
// 2. Display break
const addDisplayTextDetails= (square, playrId) => {
    const completedDisplays = ["value", "completed_by", "last_updated"]
    // Scenarios where local displayText is first set:
    // 1. Task was locally completed, displayText set upon completion, first touch moves index along
    // 2. Task was remotely completed, displayText is not set on completion, first touch sets it
    //This means on first touch remotely completed squares need to skip an index in order to keep up
    const taskWasIncomplete = square.displayTextIndex == null && square.completed_by.id === playrId;
    const remotePlayerCompleted = square.displayTextIndex == null;
    const incompleteStartingIndex = 2;
    const remoteCompletionStartingIndex = 0;
    const currentDisplayIndex = (
        taskWasIncomplete ? incompleteStartingIndex 
        : remotePlayerCompleted ? remoteCompletionStartingIndex 
        : square.displayTextIndex
    );
    const displayTextIndex = (currentDisplayIndex + 1) % completedDisplays.length;
    let displayText = square[completedDisplays[displayTextIndex]];
    switch (displayTextIndex) {
        case 2:
            displayText = formatTime(displayText);
            break;
        case 1: 
            displayText = displayText.name
            break;
    }
    return {...square, displayText, displayTextIndex}
}

// TODO: TESTING
// 1. Unit test
// 2. Offline updates will not get pushed
const saveToQueue = async (square) => {
    const storedData = await getItemAsync(STORAGE_KEYS.offlineUpdatesQueue);
    const dataArray = storedData ? JSON.parse(storedData) : [];
    dataArray.push(square);
    setItemAsync(STORAGE_KEYS.offlineUpdatesQueue, JSON.stringify(dataArray));
}

// TODO: TESTING
// 1. Unit test
// 2. Offline updates will not get pushed
const sendSavedQueue = async (sendJsonMessage) => {
    const offlineUpdatesQueue = await getItemAsync(STORAGE_KEYS.offlineUpdatesQueue);
    if (offlineUpdatesQueue) {
        const queue = JSON.parse(offlineUpdatesQueue)
        queue.forEach(square => sendJsonMessage(square))
        await deleteItemAsync(STORAGE_KEYS.offlineUpdatesQueue);
    }
}

// TODO: TESTING
// 1. Unit test
// 2. The earliest completed square will get overridden
const verifyEarliestCompletedSquare = (pushSquare, currentSquare) => {
    if (pushSquare.game_id === currentSquare.game_id) {
        const pushSquareIsEarlier = (
            new Date(pushSquare.last_updated) < new Date(currentSquare.last_updated)
        );
        return pushSquareIsEarlier ? pushSquare : currentSquare;
    }
}




const Play = ({ route }) => {
    const [game, setGame] = useState(route.params.game.tasks);
    const [saveGame, setSaveGame] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [focusedSquare, setFocusedSquare] = useState({});
    const [sendCompletedSquare, setSendCompletedSquare] = useState(null);
    const [isOffline, setIsOffline] = useState(null);
    const player = route.params.player;
    const rows = game.length;
    const cols = game[0].length;

        const { sendJsonMessage, lastJsonMessage, readyState, getWebSocket } = useWebSocket(
        `${RECIEVE_GAME_UPDATES_URL}/${game.id}/`, 
        {
            // TODO: TESTING
            // 1. Unit test
            // 2. Increases risk that local updates will permanently fail to send
            heartbeat: {
                message: 'heartbeat',
                returnMessage: 'thump',
                timeout: 60000, // 1 minute, if no response received, the connection is closed
                interval: 25000, // every 25 seconds a ping message will be sent
            },
            reconnectAttempts: 15,
            shouldReconnect: (closeEvent) => true,
            reconnectInterval: (attemptNumber) =>
                Math.min(Math.pow(2, attemptNumber) * 1000, 10000),
            onOpen: () => {
                console.log("WebSocket connected");
            },
            onClose: (event) => {
                console.log(`WebSocket closed: ${event.reason}, attempting to reconnect...`);
            },
        }
    );

    // Save game - to local storage on first entry, then on subsequent calls (saveGame state change)
    useEffect(() => {
        const saveGameToStorage = async () => { 
            let offlineGame = {...route.params.game}
            offlineGame.tasks = game;
            offlineGame.lastUpdated = Date.now();
            // TODO: TESTING
            setItemAsync(STORAGE_KEYS.offlineGameState, JSON.stringify(offlineGame));
            setSaveGame(false);
        }
        saveGame && route.params.game && saveGameToStorage();
    }, [saveGame])

    // Offline status checker
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            // TODO: TESTING
            // 1. Unit test
            // 2. Local updates and gamestate will not be saved
                // Won't be able to rejoin game offline
                // Local updates won't be saved to queue
            setIsOffline(!state.isConnected);
        });
        return () => unsubscribe();
    }, []);

    // Receiving 
    // TODO: TESTING
    // 1. Unit test
    // 2. Earlier completed remote updates won't be applied
    useEffect(() => {
        if (lastJsonMessage) {
            const data = lastJsonMessage.data;
            const square = data && data.task;
            if (square && square.completed_by.id !== player.id) {
                const currentSquare = game[square.grid_row][square.grid_column];
                const earliestSquare = verifyEarliestCompletedSquare(square, currentSquare);
                if (isEqual(square, earliestSquare)) {
                    refreshGameWithCompletedSquare(square);
                }
            }
        }
    }, [lastJsonMessage]);

    // Sending - or saving locally completed squares for future sending
    // TODO: TESTING
    // 1. Unit test
    // 2. Offline updates not saved OR sent, Online updates not sent, Offline game not saved
    useEffect(() => {
        if (isOffline === null) return;
        if (isOffline && sendCompletedSquare) {
            saveToQueue(sendCompletedSquare);
            setSendCompletedSquare(null);
        } else if (sendCompletedSquare) {
            sendJsonMessage(sendCompletedSquare);
            setSendCompletedSquare(null);
        } else if (isOffline) {
            setSaveGame(true);
        } else { 
            sendSavedQueue(sendJsonMessage);
        }
    }, [isOffline, sendCompletedSquare]); 

    const refreshGameWithCompletedSquare = (square) => {
        square = addDisplayTextDetails(square, player.id)
        setGame(prevGame => prevGame.map(row => row.map(
            prevSquare => prevSquare.id === square.id ? square : prevSquare
        )))
        setSaveGame(true);
    }

    const shareContent = async () => await Share.share({message: route.params.game.code})

    // TODO: TESTING
    // 1. Unit test
    // 2. Local task update won't be sent or saved
    const taskCompleted = async (square) => { 
        const currentSquare = game[square.grid_row][square.grid_column];
        const earliestSquare= verifyEarliestCompletedSquare(square, currentSquare);
        if (isEqual(square, earliestSquare)) {
            square = { ...square, completed: true, completed_by: player}
            refreshGameWithCompletedSquare(square);
            setSendCompletedSquare(square)
        }
        setModalVisible(false);
    }

    const taskDisplayChange = (square) => {
        square.completed && refreshGameWithCompletedSquare(square, player.id)
        setFocusedSquare(square);
        setModalVisible(!square.completed)
    }

    return (
            <View style={styles.screenContainer}>
                <IconHeader type={["home-outline"]} paths={["Home"]} />
                <Text style={styles.gameCode}>Game Code</Text>
                <View style={styles.shareContainer}>            
                    <Text style={styles.code}>{route.params.game.code}</Text>
                    <Feather name="share" onPress={shareContent} size={25}/>
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
                            return(
                            <View 
                                key={colIndex + rowIndex}
                                style={[
                                    styles.squareContainer, 
                                    {height: rows === cols ? (350 / rows) : 280 / rows,
                                    width: 350 / cols}
                            ]}>
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
                                                    {focusedSquare?.value}
                                                </Text>
                                            </View>
                                            <TouchableOpacity 
                                                style={styles.modalCompletedContainer} 
                                                onPress={() => taskCompleted(focusedSquare)}
                                            >
                                                <Text style={styles.modalCompletedText}>Completed </Text>
                                                <Feather name="check-square" size={25} color="green" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </Modal>
                            </View>
                            )
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
                    outerContentStyle={{backgroundColor: "#ffffff" }}
                >
                    <View style={styles.users}>
                        {route.params.game.players.map(player => 
                            <View key={player.id} style={styles.profileContainer}>
                                <Ionicons name="person-circle-outline" size={20} />
                                <Text>{player.name}</Text>
                            </View>
                        )}
                    </View>
                </BottomSheet>
            </View>
    )
}

export default Play;

const completeTaskStyles= (completed: boolean) => StyleSheet.create({
    innerSquare: {
        width: completed ? "100%": "80%",
        height: completed ? "100%": "80%",
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
})

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
        fontSize: 25
    },
    titleContainer: {
        marginTop: 60,
        height: 25,
        flexDirection: "row",
        borderTopColor: "transparent",
        borderRightColor: "transparent",
        borderLeftColor: "transparent",
        borderBottomColor: "black",
        borderWidth: 2,
    },
    title: {
        marginBottom: 2,
        fontSize: 18,     
        textAlign: "center",   
    },
    gridContainer: {
        marginTop: 45,
        borderWidth: .5,
        borderStyle: "solid",
        borderColor: "black",
    },
    gridRow: {
        flexDirection: "row",
    },
    squareContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: .5,
        borderStyle: "solid",
        borderColor: "black",
        display:"flex",
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
        justifyContent: "center"
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
})
