import { getItem, getItemAsync } from "expo-secure-store";


class Services {
    static async sendRequest (url: string, data: any) {
        let displayProfileModal = true;
        let error: boolean | string = false;
        let response;

        const player = await getItemAsync("player");
        if (player) {
            try {
                response = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify( {data} ),
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
            error = "The game code used did not connect, please try again."
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