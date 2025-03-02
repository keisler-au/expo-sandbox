
import React, {useState, createContext, useEffect} from "react";



const UpdateProvider = ({initialGridData, cardId, children}) => {
    const [gridData, setGridData] = useState(initialGridData);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const ws = new WebSocket(`ws://yourserver/ws/bingo/${cardId}/`);
        setSocket(ws);

        ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.card_id === cardId) {
            // Update grid data based on server update
            const updatedGrid = [...gridData]; // Update the grid
            const updatedSquare = data.square;
            updatedGrid[updatedSquare.row][updatedSquare.column] = updatedSquare.value;
            setGridData(updatedGrid); // Update context state
        }
        };

        return () => {
        ws.close();  // Cleanup when the component is unmounted
        };
    }, [cardId, gridData]);

    const handleSquareUpdate = (row, col, value) => {
        // Send update to the server via WebSocket
        socket.send(JSON.stringify({
        action: 'update_square',
        card_id: cardId,
        square: {
            row,
            column: col,
            value,
            last_updated: Date.now()
        }
        }));
    };
    useEffect(() => {
        console.log("gridData updated", gridData);
    }, [gridData]);

    return (
        
    )
    return (
        <GridDataContext.Provider value={{ gridData, setGridData }}>
            {children}
        </GridDataContext.Provider>
    );
};


export default UpdateProvider;