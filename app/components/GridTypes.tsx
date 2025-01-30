import React, { useContext} from "react";
import { useNavigation } from '@react-navigation/native';
import { Text, View, Button, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import Grid from "./GridLayout";
import { GridDataContext } from "./GridDataProvider";


const TemplateGrid = () => {
    const navigation = useNavigation();
    const handleSquarePress = (rowIndex, colIndex) => {
        navigation.navigate('SquareDetail', { rowIndex, colIndex });
    };

    return (<Animated.View style={[styles().card, animatedStyles[index]]}><Grid gridType="template" onSquarePress={handleSquarePress} /></Animated.View>);
};

const PublishGrid = () => {
    const { gridData, setGridData } = useContext(GridDataContext);

    const handleSquarePress = (rowIndex, colIndex) => {
        const newText = prompt('Edit square value:', gridData[rowIndex][colIndex]);
        if (newText) {
            const updatedGrid = [...gridData];
            updatedGrid[rowIndex][colIndex] = newText;
            setGridData(updatedGrid);
        }
    };

    return <Grid gridType="publish" onSquarePress={handleSquarePress} />;
};


const PlayGrid = () => {
    const [overlayVisible, setOverlayVisible] = React.useState(false);

    const handleSquarePress = () => {
        setOverlayVisible(true);
    };

    const handleConfirmSubmit = () => {
        setOverlayVisible(false);
    };

    const handleCancelSubmit = () => {
        setOverlayVisible(false);
    };

    return (
        <>
            <Grid gridType="play" onSquarePress={handleSquarePress} />
            {
                overlayVisible ? (
                    <View style={styles.overlay}>
                    <Text>Are you sure you want to submit this card?</Text>
                    <Button title="Yes" onPress={handleConfirmSubmit} />
                    <Button title="No" onPress={handleCancelSubmit} />
                    </View>
                ) : null
            }
        </>
    );
};
const styles = StyleSheet.create({
    overlay: {}
})



export default TemplateGrid;

export {PublishGrid, PlayGrid};