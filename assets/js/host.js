// Retrieve sessionId from the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('sessionId');

const playerSymbol = 'X'; // Host is always X
let currentPlayer = 'X'; // Track the turn
let activeMiniGrid = -1; // The allowed mini-grid for the next move
const ultimateGrid = Array(9).fill(null).map(() => Array(9).fill(null));
const miniGridStatus = Array(9).fill(null); // Track who won each mini-grid

if (sessionId) {
    const socket = new WebSocket(`ws://localhost:8080/ws/game?sessionId=${sessionId}`);

    socket.onopen = () => {
        console.log("Connected to WebSocket for game updates, session ID:", sessionId);
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const { miniGridIndex, cellIndex, player, nextTurn, nextActiveMiniGrid, type, winner } = data;

        if (type === 'GAME_OVER') {
            document.getElementById("winner-line").textContent = `Player ${winner} wins the game!`;
            return; // Stop further actions if the game is over
        }

        console.log("Received data:", data);

        // Update the cell based on the received message
        const cell = document.querySelector(`.mini-grid[data-index='${miniGridIndex}'] div[data-cell='${cellIndex}']`);
        if (cell) {
            cell.textContent = player;
            cell.classList.add('filled');
            cell.classList.remove('empty');
            currentPlayer = nextTurn; // Update turn to the next player
            activeMiniGrid = nextActiveMiniGrid; // Update allowed grid
            document.getElementById("info").textContent = `Current turn: ${currentPlayer}`;
            updateGridHighlight(); // Reflect allowed/disallowed grids
        }
    };

    socket.onclose = () => {
        console.log("Disconnected from WebSocket");
    };

    socket.onerror = (error) => {
        console.error("WebSocket error:", error);
    };

    function handleCellClick(event) {
        if (currentPlayer !== playerSymbol) {
            console.log("Not your turn!");
            return; // Prevent move if it’s not this player's turn
        }

        const cell = event.target;
        const [miniGridIndex, cellIndex] = cell.dataset.index.split('-').map(Number);

        // Check if cell is already filled or if it's in an inactive mini-grid
        if (ultimateGrid[miniGridIndex][cellIndex] || (activeMiniGrid !== -1 && activeMiniGrid !== miniGridIndex)) {
            return;
        }

        // Update local game state
        ultimateGrid[miniGridIndex][cellIndex] = playerSymbol;
        cell.textContent = playerSymbol;
        cell.classList.add('filled');
        cell.classList.remove('empty');

        // Check if the current player won this mini-grid
        if (checkMiniGridWinner(ultimateGrid[miniGridIndex])) {
            miniGridStatus[miniGridIndex] = playerSymbol; // Mark mini-grid as won by the current player
            const miniGridElement = document.querySelectorAll('.mini-grid')[miniGridIndex];
            miniGridElement.classList.add(`won-${currentPlayer}`);
            miniGridElement.setAttribute('data-winner', playerSymbol);

            // Check if the current player won the ultimate grid
            if (checkUltimateGridWinner()) {
                document.getElementById("winner-line").textContent = `Player ${playerSymbol} wins the game!`;
                socket.send(JSON.stringify({ type: 'GAME_OVER', winner: playerSymbol, sessionId })); // Send game over message
                return; // Stop further moves
            }
        }

        // Calculate the next player and next allowed grid
        const nextTurn = playerSymbol === 'X' ? 'O' : 'X';
        activeMiniGrid = cellIndex;
        if (miniGridStatus[activeMiniGrid]) activeMiniGrid = -1;

        // Send move data to WebSocket
        const moveData = {
            miniGridIndex,
            cellIndex,
            player: playerSymbol,
            nextTurn,
            nextActiveMiniGrid: activeMiniGrid,
            sessionId: sessionId
        };
        console.log("Sending move data:", moveData);
        socket.send(JSON.stringify(moveData));

        // Update turn and highlight for the current player
        currentPlayer = nextTurn;
        document.getElementById("info").textContent = `Current turn: ${currentPlayer}`;
        updateGridHighlight();
    }

    function updateGridHighlight() {
        document.querySelectorAll('.mini-grid').forEach((grid, index) => {
            grid.classList.remove('active');
            if (activeMiniGrid === -1 || activeMiniGrid === index) {
                grid.classList.add('active');
            }
        });
    }

    // Helper functions to check for wins
    function checkMiniGridWinner(grid) {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];
        return winningCombinations.some(combination =>
            combination.every(index => grid[index] && grid[index] === grid[combination[0]])
        );
    }

    function checkUltimateGridWinner() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];
        return winningCombinations.some(combination =>
            combination.every(index => miniGridStatus[index] && miniGridStatus[index] === miniGridStatus[combination[0]])
        );
    }

    // Initialize the cells with click listeners and unique data attributes
    document.querySelectorAll('.mini-grid div').forEach((cell, index) => {
        const miniGridIndex = Math.floor(index / 9);
        const cellIndex = index % 9;
        cell.dataset.index = `${miniGridIndex}-${cellIndex}`;
        cell.addEventListener('click', handleCellClick);
        cell.classList.add('empty');
    });

    updateGridHighlight();
} else {
    console.error("sessionId parameter is missing in the URL");
}