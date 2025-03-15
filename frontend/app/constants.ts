const SENTRY_DNS = process.env.EXPO_PUBLIC_SENTRY_DNS;
const SERVER =
  process.env.NODE_ENV === "production"
    ? process.env.EXPO_PUBLIC_SERVER
    : "727b-89-205-130-170.ngrok-free.app";
export const URLS = {
  PUBLISH_GAME_URL: `https://${SERVER}/game/publish_game/`,
  JOIN_GAME_URL: `https://${SERVER}/game/join_game/`,
  CREATE_PLAYER_URL: `https://${SERVER}/game/create_player/`,
  WEBSOCKET_UPDATES_URL: `wss://${SERVER}/ws/socket-server`,
  SENTRY_DNS,
};

const STORAGE_KEYS: { [key: string]: string } = {};
["player", "offlineUpdatesQueue", "offlineGameState"].forEach(
  (key) => (STORAGE_KEYS[key] = key),
);
export { STORAGE_KEYS };

export default {};
