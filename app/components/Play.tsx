import React, {useState, useRef} from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import {shareAsync} from 'expo-sharing';
import IconHeader from "./IconHeader"
import { Feather, Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import BottomSheet from 'react-native-simple-bottom-sheet';




const Play = ({route}) => {
    const game = route.params.game;
    const rows = game.length;
    const cols = game[0].length;
    const [title, setTitle] = useState("#GameA1B2C3");
    const [modalVisible, setModalVisible] = useState(false);
    const [eventText, setEventText] = useState();
    const [selectedSquare, setSelectedSquare] = useState();


    const shareContent = async () => {
        try {
            await shareAsync('https://example.com');
            } catch (error) {
            console.error('Error sharing content:', error);
            }
        };
    
    const taskChange = (item) => {
        let showModal = true;
        // if (completed) {
        //     setEventText("play that completed task")
        //     showModal = false;
        // } 
        setModalVisible(showModal)
        setSelectedSquare(item)
    }

    return (
        <View style={styles.screenContainer}>
            <IconHeader type={["home-outline"]} paths={["Home"]} />
            <Text style={styles.gameCode}>Game Code</Text>
            <View style={styles.shareContainer}>            
                <Text style={styles.code}>A1B-2C3</Text>
                <Feather name="share" onPress={shareContent} size={20}/>
            </View>
            <View style={styles.titleContainer}>
                <TextInput 
                    style={styles.title} 
                    value={title}
                    onChangeText={(value) => setTitle(value)}
                    ></TextInput>
                <Feather name="edit-3" size={20}/>
            </View>
            <View style={styles.gridContainer}>
                {game.map((_, rowIndex) => (
                    <View key={rowIndex} style={styles.gridRow}>
                    {game[rowIndex].map((_, colIndex) => {
                        return(
                        <View 
                            key={colIndex + rowIndex}
                            style={[
                                styles.squareContainer, 
                                {height: rows === cols ? (350 / rows) : 280 / rows,
                                width: 350 / cols}
                        ]}>
                            <TouchableOpacity 
                                style={styles.innerSquare} 
                                onPress={() => taskChange(game[rowIndex][colIndex])}
                            >
                                <Text
                                    style={[styles.gridText]}
                                >
                                    {game[rowIndex][colIndex]}
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
                                                {selectedSquare}
                                            </Text>
                                        </View>
                                        <TouchableOpacity 
                                            style={styles.modalCompletedContainer} 
                                            onPress={() => setModalVisible(false)}
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
    innerSquare: {
        width: "80%",
        height: "80%",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "black",
        elevation: 10, // Shadow for Android
        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        shadowOffset: { width: 0, height: 4 },
        backgroundColor: "#ffffff",
    },
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
