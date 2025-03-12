import { Player, Task as Square } from "./types";

export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

interface SquareDisplayProps {
  displayTextIndex?: any;
  completed_by: Player;
}
const getStartingIndex = (
  { displayTextIndex, completed_by }: SquareDisplayProps,
  playerId: number,
) => {
  // Locally the displayText is first set in these scenarios:
  // 1. Task locally completed, displayText set upon completion, next sq touch moves index along
  // 2. Task remotely completed, displayText has not been set, next sq touch sets index
  // For remotely completed sqrs first touch needs set index +1 compared to locally completed
  if (displayTextIndex == null && completed_by.id === playerId) return 2;
  if (displayTextIndex == null) return 0;
  return displayTextIndex;
};

const getDisplayText = (index: number, value: any) => {
  switch (index) {
    case 2:
      return formatTime(value);
    case 1:
      return value.name;
    default:
      return value;
  }
};
// TODO: TESTING
// 1. Unit test
// 2. Display break
export const addDisplayTextDetails = (square: Square, playerId: number) => {
  const displays = ["value", "completed_by", "last_updated"];
  const startingIndex = getStartingIndex(square, playerId);
  const index = (startingIndex + 1) % displays.length;
  const displayText = getDisplayText(index, square[displays[index]]);
  return { ...square, displayText, displayTextIndex: index };
};

export default {};
