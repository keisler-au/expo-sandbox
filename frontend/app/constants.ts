
class URLS {

}
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://joshkeisler.com"
    : "https://52f9-80-201-246-194.ngrok-free.app";
    
const PUBLISH_GAME_URL = BASE_URL + "/game/publish_game/";
const JOIN_GAME_URL = BASE_URL + "/game/join_game/?game=$";


export { 
    PUBLISH_GAME_URL,
    JOIN_GAME_URL
};

export default {};