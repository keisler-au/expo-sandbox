
const DYNAMIC_URL = "2a64"
const SERVER = `${DYNAMIC_URL}-80-201-246-194.ngrok-free.app`

const BASE_HTTP =
  process.env.NODE_ENV === "production"
    ? ""
    : "https://" + SERVER;
    
export const PUBLISH_GAME_URL = BASE_HTTP + "/game/publish_game/";
export const JOIN_GAME_URL = BASE_HTTP + "/game/join_game/";
export const CREATE_PLAYER_URL = BASE_HTTP + "/game/create_player/"


const BASE_SOCKET =
  process.env.NODE_ENV === "production"
  ? ""
  : "wss://" + SERVER;

export const RECIEVE_GAME_UPDATES_URL = BASE_SOCKET + "/ws/socket-server/";


export default {};