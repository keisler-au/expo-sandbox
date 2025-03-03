import React, {useState, useRef, useEffect} from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import {shareAsync} from 'expo-sharing';
import IconHeader from "./IconHeader"
import { Feather, Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import BottomSheet from 'react-native-simple-bottom-sheet';
import NetInfo from '@react-native-community/netinfo';
import UpdateProvider from './UpdateProvider';
import { saveSnapshot } from 'react-native-reanimated/src/layoutReanimation/web';
import Services from '../services';
import { getItemAsync, setItemAsync, deleteItemAsync } from 'expo-secure-store';

import { isEqual } from 'lodash';
import { push } from 'expo-router/build/global-state/routing';


const completedDisplays = [
    "value",
    "completed_by",
    "last_updated",
]

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

const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}

// const verifyEarliestCompletedSquare = (pushSquare, currentSquare) => {
//     if (pushSquare.game_id === currentSquare.game_id) {
//         // TODO: The lt time check is pseudo code
//         const pushSquareIsEarlier = pushSquare.last_updated < currentSquare.last_updated;
//         return pushSquareIsEarlier ? pushSquare : currentSquare;
//     }
// }
const verifyEarliestCompletedSquare = (pushSquare, currentSquare) => {
    if (pushSquare.game_id === currentSquare.game_id) {
        // TODO: The lt time check is pseudo code
        const pushSquareIsEarlier = pushSquare.last_updated < currentSquare.last_updated;
        return pushSquareIsEarlier ? pushSquare : currentSquare;
    }
}

// const verifyGame = (localGame, networkGame) => {
//     return networkGame.map(task => {
//         const localTask = localGame[task.grid_row][task.grid_column];
//         return verifyEarliestCompletedSquare(task, localTask)
//     })
// }

const PlayWrapper = ({route}) => (
    <UpdateProvider 
        game={route.params.game}
        render={(networkGame, socket) => <Play gameData={networkGame} socket={socket} />}
    />
)


// const Play = ({route}) => {
const Play = async ({ gameData, socket }) => {
    const [game, setGame] = useState(gameData.tasks);
    const [saveGame, setSaveGame] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [completedDisplayIndex, setCompletedDisplayIndex] = useState<number>(0);
    const [modalSquareText, setModalSquareText] = useState();
    const [sendCompletedSquare, setSendCompletedSquare] = useState(null);
    const [isOffline, setIsOffline] = useState(null);

    const rows = game.length;
    const cols = game[0].length;

    // If network game is out of sync from local game then get all tasks with earliest completed timestamps
    // if (!isEqual(game, gameData.tasks)) {
    //     setGame(verifyGame(game, gameData.tasks));
    // }

    // useEffect - to save game to local storage on first entry
    useEffect(() => {
        const saveGameToStorage = async () => { 
            gameData.tasks = game;
            gameData.last_updated = Date.now();
            setItemAsync("offlineGameState", JSON.stringify(gameData));
            setSaveGame(false);
        }
        saveGame && gameData && saveGameToStorage();
    }, [saveGame])

        // first render triggers this
            // online - send nothing - don't save game
            // offline - send nothing - don't save game
        // sendCompletedSquare change triggers this 
            // it will have come from local taskCompleted
                // online - send single updated square - don't save game
                // offline - save current local square to queue - save game
        // isOffline change triggers this 
            // change to online - send saved updated squares - don't save game
            // change to offline - send nothing - save game
        
        // isoffline === null && sendCompletedSquare === null: return
            // send nothing
            // don't save game
        // isoffline 
            // sendCompletedSquare 
                // save current local square to queue
            // save game
        // !isoffline
            // offlineUpdatesQueue = await getItemAsync()
            // offlineUpdatesQueue 
                // send saved updated squares
                // clear queue
            // sendCompletedSquare
                // send single updated square
    // Online status checker
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
        setIsOffline(!state.isConnected);
        });

        return () => unsubscribe();
    }, []);


    // Sending or Saving locally completed squares
    useEffect(() => {
        if (isOffline === null) return;
        if (isOffline && sendCompletedSquare) {
            saveToQueue(sendCompletedSquare);
            setSendCompletedSquare(null);
        } else if (sendCompletedSquare) {
            socket.send(JSON.stringify(sendCompletedSquare));
            setSendCompletedSquare(null);
        } else if (isOffline) {
            setSaveGame(true);
        } else {
            sendSavedQueue();
        }
        // TODO: should game be here? 
    }, [isOffline, sendCompletedSquare, game]); 

    // Recieving completed squares from network
    useEffect(() => {
        // TODO: update url - add to constants
        const ws = new WebSocket(`ws://yourserver/ws/bingo/${game.id}/`);

        ws.onmessage = (event) => {
            const square = JSON.parse(event.data);
            const currentSquare = game[square.grid_row][square.grid_column];
            const earliestSquare = verifyEarliestCompletedSquare(square, currentSquare);
            if (isEqual(square, earliestSquare)) {
                setGame(prev => prev[square.grid_row][square.grid_column] = square);
            }
        };

        return () => {
            ws.close();
        };
    }, [cardId, game]);

    const shareContent = async () => {
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
            square.completed = true;
            square.completed_by = await getItemAsync("player");
            setGame(prev => prev[square.grid_row][square.grid_column] = square);
            setSendCompletedSquare(square)
        }
        // TODO: Modal notis and retry mechanism?
        // setUpdateState(response.updateState)
        setModalVisible(false);
    }
    
    const taskDisplayChange = (item) => {
        // TODO: Format time for display
        let showModal = true;
        if (item.completed) {
            showModal = false;
            setCompletedDisplayIndex((prevIndex) => (prevIndex + 1) % completedDisplays.length)
        } 
        setModalVisible(showModal)
        if (showModal) {
            setModalSquareText(item.value)
        }
    }

    return (
        <UpdateProvider render={(updatedSquare) => (
            <View style={styles.screenContainer}>
                <IconHeader type={["home-outline"]} paths={["Home"]} />
                <Text style={styles.gameCode}>Game Code</Text>
                <View style={styles.shareContainer}>            
                    <Text style={styles.code}>FUCK FUCKING FUCKER</Text>
                    <Feather name="share" onPress={shareContent} size={20}/>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{gameData.title}</Text>
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
                                    // style={styles.innerSquare} 
                                    style={completeTaskStyles(square.completed)}
                                    onPress={() => taskDisplayChange(square)}
                                >
                                    <Text
                                        style={[styles.gridText]}
                                    >
                                        {square[completedDisplays[completedDisplayIndex]]}
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
                                                    {modalSquareText}
                                                </Text>
                                            </View>
                                            <TouchableOpacity 
                                                style={styles.modalCompletedContainer} 
                                                onPress={() => taskCompleted(square)}
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
        )}/>
    )
}

export default PlayWrapper;

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
