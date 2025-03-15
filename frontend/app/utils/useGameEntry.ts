import { useState } from "react";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { getItemAsync } from "expo-secure-store";

import { saveGameToStorage } from "./gameActions";
import { Game, RootStackParamList } from "../types";
import { STORAGE_KEYS } from "../constants";
import RequestService from "../services";

const useGameEntry = () => {
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, "Play">>();
  const [loading, setLoading] = useState(false);
  const [playerModal, setPlayerModal] = useState(false);
  const [error, setError] = useState<string | boolean>(false);

  const getStoredPlayer = async () => {
    const storedPlayer = await getItemAsync(STORAGE_KEYS.player);
    return storedPlayer ? JSON.parse(storedPlayer) : null;
  };

  const handleGameEntry = async (
    url: string,
    data: any,
    isOffline?: boolean,
    previousGame?: Game,
  ) => {
    if (loading) return;
    setLoading(true);

    const player = await getStoredPlayer();
    if (!player) {
      setLoading(false);
      return setPlayerModal(true);
    }

    if (isOffline && previousGame) {
      navigation.navigate("Play", { game: previousGame, player });
    } else {
      data = { ...data, player_id: player.id };
      const { response, error } = await RequestService.sendRequest(url, data);
      if (response?.ok && !error) {
        const game = (await response.json()).game;
        saveGameToStorage(game);
        navigation.navigate("Play", { game, player });
      }
      setError(error);
    }
    setLoading(false);
  };

  return {
    loading,
    playerModal,
    setPlayerModal,
    error,
    setError,
    handleGameEntry,
  };
};

export default useGameEntry;
