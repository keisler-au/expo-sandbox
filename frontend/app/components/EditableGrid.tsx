import { StyleSheet, TextInput, View } from "react-native";


const EditableGrid = ({ game, rows, cols, onChange }) => (
  <View style={[styles.gridContainer, {bottom: rows === cols ? "35%" : "39%"}]}>
    {Array.from({length: rows}).map((_, rowIndex) => (
      <View key={rowIndex} style={styles.gridRow}>
        {Array.from({length: cols}).map((_, colIndex) => {
          return(
            <TextInput
              key={colIndex + rowIndex}
              multiline={true}
              submitBehavior="blurAndSubmit"
              style={[styles.gridText, {
                height: rows === cols ? (350 / rows) : 280 / rows,
                width: 350 / cols,
              }]}
              value={game[rowIndex][colIndex]}
              onChangeText={(input) => onChange(input, rowIndex, colIndex)}
            />
          )
        })}
      </View>
    ))}
  </View>
)

export default EditableGrid;


const styles = StyleSheet.create({
  gridContainer: {
    position: "absolute",
    right: "5%",
    left: "5%",
    borderWidth: 0.5,
    backgroundColor: "#FAF9F6",
    zIndex: 2,
  },
    gridRow: {
    flexDirection: "row",
  },
  gridText: {
    borderWidth: 0.5,
    fontSize: 15,
    textAlign: "center",
    fontWeight: 'bold',
    borderStyle: "solid",
    borderColor: "black",
  },
})