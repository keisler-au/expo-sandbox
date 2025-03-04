import React, {useState, useEffect} from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import {shareAsync} from 'expo-sharing';
import IconHeader from "./IconHeader"
import { Feather, Ionicons } from '@expo/vector-icons';
import BottomSheet from 'react-native-simple-bottom-sheet';
import NetInfo, { refresh } from '@react-native-community/netinfo';
import { getItemAsync, setItemAsync, deleteItemAsync } from 'expo-secure-store';

import { isEqual } from 'lodash';
import { RECIEVE_GAME_UPDATES_URL } from '../constants';






const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}

const addDisplayTextDetails= (square) => {
    const completedDisplays = ["value", "completed_by", "last_updated"]
    const currentDisplayIndex = square.displayTextIndex == null ? 2 : square.displayTextIndex;
    const displayTextIndex = (currentDisplayIndex + 1) % completedDisplays.length;
    let displayText = square[completedDisplays[displayTextIndex]];
    const formattedTime = formatTime(displayText);
    if (formattedTime !== "Invalid Date") { displayText = formattedTime }
    return {...square, displayText, displayTextIndex}
}

const saveToQueue = async (square) => {
    const storedData = await getItemAsync("offlineUpdatesQueue");
    const dataArray = storedData ? JSON.parse(storedData) : [];
    dataArray.push(square);
    setItemAsync("offlineUpdatesQueue", JSON.stringify(dataArray));
}

const sendSavedQueue = async () => {
    const offlineUpdatesQueue = await getItemAsync("offlineUpdatesQueue");
    if (offlineUpdatesQueue) {
        const queue = JSON.parse(offlineUpdatesQueue)
        queue.forEach(square => socket.send(JSON.stringify(square)))
        await deleteItemAsync("offlineUpdatesQueue");
    }
}

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
    // const [completedDisplayText, setCompletedDisplayText] = useState(null);
    const [isOffline, setIsOffline] = useState(null);
    const [socket, setSocket] = useState<WebSocket | undefined>();

    const rows = game.length;
    const cols = game[0].length;


    const refreshGameWithCompletedSquare = (square) => {
        square = addDisplayTextDetails(square)
        setGame(prevGame => prevGame.map(row => row.map(prevSquare =>
                    prevSquare.id === square.id 
                    ? square
                    : prevSquare
                )
            )
        )
    }

    // useEffect - to save game to local storage on first entry
    useEffect(() => {
        console.log("Save Game: how many times is this rendering?")
        const saveGameToStorage = async () => { 
            route.params.game.tasks = game;
            route.params.game.last_updated = Date.now();
            setItemAsync("offlineGameState", JSON.stringify(route.params.game));
            setSaveGame(false);
        }
        saveGame && route.params.game && saveGameToStorage();
    }, [saveGame])

    // Online status checker
    useEffect(() => {
        console.log("NetInfo: how many times is this rendering?")
        const unsubscribe = NetInfo.addEventListener(state => {
        setIsOffline(!state.isConnected);
        });

        return () => unsubscribe();
    }, []);

    // Recieving completed squares from network
    useEffect(() => {
        console.log("Web Socket: how many times is this rendering?")
        const ws = new WebSocket(`${RECIEVE_GAME_UPDATES_URL}/${game.id}/`);
        setSocket(ws);
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const square = data.task;
            const currentSquare = game[square.grid_row][square.grid_column];
            const earliestSquare = verifyEarliestCompletedSquare(square, currentSquare);
            isEqual(square, earliestSquare) && refreshGameWithCompletedSquare(square);
        };

        return () => ws.close();
    }, [game.id]);

    // Sending or Saving locally completed squares
    useEffect(() => {
        console.log("Sending: how many times is this rendering?")
        if (isOffline === null) return;
        if (isOffline && sendCompletedSquare) {
            saveToQueue(sendCompletedSquare);
            setSendCompletedSquare(null);
        } else if (sendCompletedSquare) {
            socket?.send(JSON.stringify(sendCompletedSquare));
            setSendCompletedSquare(null);
        } else if (isOffline) {
            setSaveGame(true);
        } else {
            sendSavedQueue();
        }
    }, [isOffline, sendCompletedSquare]); 

    const shareContent = async () => {
        // TODO
        try {
            await shareAsync('https://example.com');
            } catch (error) {
            console.error('Error sharing content:', error);
            }
        };
    

    const taskCompleted = async (square) => { 
        const currentSquare = game[square.grid_row][square.grid_column];
        const earliestSquare= verifyEarliestCompletedSquare(square, currentSquare);
        if (isEqual(square, earliestSquare)) {
            const player = await getItemAsync("player");
            square = { ...square, completed: true, completed_by: player}
            refreshGameWithCompletedSquare(square);
            setSendCompletedSquare(square)
        }
        // TODO: Modal notis and retry mechanism?
        // setUpdateState(response.updateState)
        setModalVisible(false);
    }

    const taskDisplayChange = (square) => {
        if (square.completed) {
            // Change the display text of the square and save it into game state
            refreshGameWithCompletedSquare(square)
        }
        setFocusedSquare(square);
        setModalVisible(!square.completed)
    }

    return (
            <View style={styles.screenContainer}>
                <IconHeader type={["home-outline"]} paths={["Home"]} />
                <Text style={styles.gameCode}>Game Code</Text>
                <View style={styles.shareContainer}>            
                    <Text style={styles.code}>FUCK FUCKING FUCKER</Text>
                    <Feather name="share" onPress={shareContent} size={20}/>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{route.params.game.title}</Text>
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
                                    style={completeTaskStyles(square.completed)}
                                    onPress={() => taskDisplayChange(square)}
                                >
                                    <Text
                                        style={[styles.gridText]}
                                    >
                                        {square.completed
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
                        <View style={styles.profileContainer}>
                            <Ionicons name="person-circle-outline" size={20} />
                            <Text>Player Name 1</Text>
                        </View>
                        <View style={styles.profileContainer}>
                            <Ionicons name="person-circle-outline" size={20} />
                            <Text>Player Name 2</Text>
                        </View>
                        <View style={styles.profileContainer}>
                            <Ionicons name="person-circle-outline" size={20} />
                            <Text>Player Name 3</Text>
                        </View>
                        <View style={styles.profileContainer}>
                            <Ionicons name="person-circle-outline" size={20} />
                            <Text>Player Name 4</Text>
                        </View>
                    </View>
                </BottomSheet>
            </View>
    )
}

export default Play;

const completeTaskStyles= (completed) => StyleSheet.create({
    // innerSquare: {
        width: completed ? "100%": "80%",
        height: completed ? "100%": "80%",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: completed ? 0 : 1,
        borderStyle: "solid",
        borderColor: "black",
        elevation: 10, // Shadow for Android
        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        shadowOffset: { width: 0, height: 4 },
        backgroundColor: completed ? "#e0e0e0" : "#ffffff",
    // },
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
        fontSize: 18
    },
    titleContainer: {
        marginTop: 60,
        height: 20,
        flexDirection: "row",
        borderTopColor: "transparent",
        borderRightColor: "transparent",
        borderLeftColor: "transparent",
        borderBottomColor: "black",
        borderWidth: 1,
    },
    title: {
        width: 200,
        fontSize: 18,        
    },
    gridContainer: {
        marginTop: 60,
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
    // innerSquare: {
    //     width: "80%",
    //     height: "80%",
    //     alignItems: "center",
    //     justifyContent: "center",
    //     borderWidth: 1,
    //     borderStyle: "solid",
    //     borderColor: "black",
    //     elevation: 10, // Shadow for Android
    //     // shadowColor: "#000",
    //     // shadowOffset: { width: 0, height: 10 },
    //     shadowOpacity: 0.2,
    //     shadowRadius: 1,
    //     shadowOffset: { width: 0, height: 4 },
    //     backgroundColor: "#ffffff",
    // },
    gridText: {
        fontSize: 10,
        // fontWeight: 'bold',
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
        gap: 20
    },
    profileContainer: {
        flexDirection: "row",
        gap: 10
    },
})
