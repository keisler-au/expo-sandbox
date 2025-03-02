import { getItemAsync } from "expo-secure-store";


class Services {
    static async publishedGame (url: string, game: any) {
        let displayProfileModal = true;
        let error: boolean | string = false;
        let response;

        if (await getItemAsync("player")) {
            try {
                response = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify( {game} ),
                });
            } catch (e) {
                console.log(e.toString())
                error = "We failed to connect to the server and so were not able to enter the game. Please try again.";
            } finally {
                displayProfileModal = false;
            }
        }

        if (response?.ok) {
            response = await response.json();
            response.ok = true;
        } 
        if (response?.ok === false && response.status === 404) {
            error = "The game code used was not a valid game, please try again."
        }

        const result = {
            displayProfileModal,
            error,
            response
        }
        return result;
    }
}


export default Services;