
import React, {useState, createContext, useEffect} from "react";



const UpdateProvider = ({ game, render }) => {
    const [game, setGame] = useState(initialGame);

    // this also needs to go through verify-online-execute
    useEffect(() => {
        const ws = new WebSocket(`ws://yourserver/ws/bingo/${cardId}/`);
        setSocket(ws);
        // recieve network update
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.card_id === cardId) {
                const updatedGrid = [...game];
                const updatedSquare = data.square;
                updatedGrid[updatedSquare.row][updatedSquare.column] = updatedSquare.value;
                setGame(updatedGrid);
            }
        };

        return () => {
            ws.close();
        };
    }, [cardId, game]);

    const handleSquareUpdate = (row, col, value) => {
        // send local update

    };

    return render(game, ws)
};


export default UpdateProvider;