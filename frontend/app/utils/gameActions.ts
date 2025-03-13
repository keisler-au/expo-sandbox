import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";

import { Game, Task as Square } from "../types";
import { STORAGE_KEYS } from "../constants";
import { addDisplayTextDetails } from "./displayText";

export const getStoredPlayer = async () => {
  const storedPlayer = await getItemAsync(STORAGE_KEYS.player);
  return storedPlayer ? JSON.parse(storedPlayer) : null;
};

// TODO: TESTING
// 1. Unit test
// 2. Offline updates will not get pushed
export const saveToQueue = async (square: Square) => {
  const storedData = await getItemAsync(STORAGE_KEYS.offlineUpdatesQueue);
  const dataArray = storedData ? JSON.parse(storedData) : [];
  dataArray.push(square);
  setItemAsync(STORAGE_KEYS.offlineUpdatesQueue, JSON.stringify(dataArray));
};

// TODO: TESTING
// 1. Unit test
// 2. Offline updates will not get pushed
export const sendSavedQueue = async (sendJsonMessage: Function) => {
  const offlineUpdates = await getItemAsync(STORAGE_KEYS.offlineUpdatesQueue);
  if (offlineUpdates) {
    JSON.parse(offlineUpdates).forEach((square: Square) =>
      sendJsonMessage(square),
    );
    await deleteItemAsync(STORAGE_KEYS.offlineUpdatesQueue);
  }
};

export const updateGame = (
  square: Square,
  playerId: number,
  game: Square[][],
) => {
  square = addDisplayTextDetails(square, playerId);
  let updated = game.map((row) => [...row]);
  updated[square.grid_row][square.grid_column] = square;

  return updated;
};

export const saveGameToStorage = async (game: Game) => {
  setItemAsync(
    STORAGE_KEYS.offlineGameState,
    JSON.stringify({ ...game, tasks: game, lastSaved: Date.now() }),
  );
};

// TODO: TESTING
// 1. Unit test
// 2. The earliest completed square will get overridden
export const verifyEarliestCompletedSquare = (
  pushSquare: Square,
  currentSquare: Square,
) => {
  if (pushSquare.game_id === currentSquare.game_id) {
    const pushSquareIsEarlier =
      new Date(pushSquare.last_updated) < new Date(currentSquare.last_updated);
    return pushSquareIsEarlier ? pushSquare : currentSquare;
  }
};

export const reformatGame = (game: string[], rows: number, cols: number) =>
  Array.from({ length: rows }, (_, rowIndex) =>
    game.slice(rowIndex * cols, (rowIndex + 1) * rows),
  );

export default {};
