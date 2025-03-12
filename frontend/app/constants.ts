const DYNAMIC_URL = "d54d";
const SERVER = `${DYNAMIC_URL}-84-241-201-129.ngrok-free.app`;
const BASE_HTTP =
  process.env.NODE_ENV === "production" ? "" : "https://" + SERVER;
const BASE_SOCKET =
  process.env.NODE_ENV === "production" ? "" : "wss://" + SERVER;

export const PUBLISH_GAME_URL = BASE_HTTP + "/game/publish_game/";
export const JOIN_GAME_URL = BASE_HTTP + "/game/join_game/";
export const CREATE_PLAYER_URL = BASE_HTTP + "/game/create_player/";
export const RECIEVE_GAME_UPDATES_URL = BASE_SOCKET + "/ws/socket-server/";

export const STORAGE_KEYS = Object.fromEntries(
  ["player", "offlineUpdatesQueue", "offlineGameState"].map((key) => [
    key,
    key,
  ]),
);

export default {};
