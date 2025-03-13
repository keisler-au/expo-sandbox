import {
  GestureResponderEvent,
  Modal,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Task } from "../types";

interface ModalProps {
  modalVisible: boolean;
  modalTask: Task | null;
  onComplete: (event: GestureResponderEvent) => void;
  onClose: (event: NativeSyntheticEvent<any>) => void;
}
const CompleteTaskModal = ({
  modalVisible,
  modalTask,
  onComplete,
  onClose,
}: ModalProps) => {
  return (
    <Modal transparent={true} visible={modalVisible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeCross} onPress={onClose}>
            <Ionicons name="close-outline" size={35} />
          </TouchableOpacity>
          <View style={styles.modalDescriptionTextContainer}>
            <Text style={styles.modalDescriptionText}>{modalTask?.value}</Text>
          </View>
          <TouchableOpacity
            style={styles.modalCompletedContainer}
            onPress={onComplete}
          >
            <Text style={styles.modalCompletedText}>Completed</Text>
            <Feather name="check-square" size={25} color="green" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CompleteTaskModal;

const styles = StyleSheet.create({
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
});
