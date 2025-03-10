import { getItem, getItemAsync } from "expo-secure-store";
import { STORAGE_KEYS } from "./constants";


class Services {
    static async sendRequest (url: string, data: any) {
        let response;
        let error: boolean | string = false;
        // TODO: TESTING
        try {
            response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify( {data} ),
            });
        } catch (e) {
            console.log(e.toString())
            error = "We failed to connect to the server and so were not able to enter the game. Please try again.";
        }

        if (response?.ok) {
            response = await response.json();
            response.ok = true;
        } 
        if (response?.ok === false && response.status === 404) {
            error = "The game code used did not connect, please check it is correct and try again."
        }

        return { response, error, }
    }
}


export default Services;