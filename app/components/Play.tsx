import React, {useState} from 'react';
import { View, Text, StyleSheet} from 'react-native';

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
    const shareContent = async () => {
        try {
            await shareAsync('https://example.com');
            } catch (error) {
            console.error('Error sharing content:', error);
            }
        };

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
                        <View style={[styles.squareContainer, {
                                height: rows === cols ? (350 / rows) : 280 / rows,
                                width: 350 / cols,
                            }]}>
                        <Text
                            key={colIndex + rowIndex}
                            style={[styles.gridText]}
                        >
                            {game[rowIndex][colIndex]}
                        </Text>
                        </View>
                        )
                    })}
                    </View>
                ))}
            </View>
            <BottomSheet 
                isOpen 
                // style={styles.bottomSheet}
                sliderMinHeight={40}
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
    },
    gridRow: {
        flexDirection: "row",
    },
    squareContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "black",

    },
    gridText: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: 'bold',
    },
    users: {
        flexDirection: "row",
        flexWrap: "wrap",
        // justifyContent: "center",
        gap: 20
    },
    profileContainer: {
        flexDirection: "row",
        gap: 10
    },
})
