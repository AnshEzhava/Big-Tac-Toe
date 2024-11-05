const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('sessionId');

if (sessionId) {
    const socket = new WebSocket(`ws://localhost:8080/ws/game?sessionId=${sessionId}`);

    socket.onopen = () => {
        console.log("Connected to WebSocket for game updates, session ID:", sessionId);
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const { miniGridIndex, cellIndex, player } = data;

        console.log("Received data:", data);

        const cell = document.querySelector(`.mini-grid[data-index='${miniGridIndex}'] div[data-cell='${cellIndex}']`);
        if (cell) {
            cell.textContent = player;
            cell.classList.add('filled');
            cell.classList.remove('empty');
            currentPlayer = player === 'X' ? 'O' : 'X';
            document.getElementById("info").textContent = `Current turn: ${currentPlayer}`;
        }
    };

    socket.onclose = () => {
        console.log("Disconnected from WebSocket");
    };

    socket.onerror = (error) => {
        console.error("WebSocket error:", error);
    };

    let currentPlayer = 'X';
    const ultimateGrid = Array(9).fill(null).map(() => Array(9).fill(null));
    const miniGridStatus = Array(9).fill(null);
    let activeMiniGrid = -1;

    function handleCellClick(event) {
        const cell = event.target;
        const [miniGridIndex, cellIndex] = cell.dataset.index.split('-').map(Number);

        if (ultimateGrid[miniGridIndex][cellIndex] || (activeMiniGrid !== -1 && activeMiniGrid !== miniGridIndex)) {
            return;
        }

        ultimateGrid[miniGridIndex][cellIndex] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add('filled');
        cell.classList.remove('empty');

        const moveData = {
            miniGridIndex,
            cellIndex,
            player: currentPlayer,
            sessionId: sessionId
        };
        console.log("Sending move data:", moveData);
        socket.send(JSON.stringify(moveData));

        if (checkWinner(ultimateGrid[miniGridIndex])) {
            miniGridStatus[miniGridIndex] = currentPlayer;
            const miniGridElement = document.querySelectorAll('.mini-grid')[miniGridIndex];
            miniGridElement.classList.add(`won-${currentPlayer}`);
            miniGridElement.setAttribute('data-winner', currentPlayer);
        }

        if (checkWinner(miniGridStatus)) {
            document.getElementById("winner-line").textContent = `Player ${currentPlayer} wins the game!`;
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        document.getElementById("info").textContent = `Current turn: ${currentPlayer}`;

        // Set the next active mini-grid based on the last move
        activeMiniGrid = cellIndex;
        if (miniGridStatus[activeMiniGrid]) activeMiniGrid = -1;

        updateGridHighlight();
    }

    function checkWinner(grid) {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        return winningCombinations.some(combination =>
            combination.every(index => grid[index] && grid[index] === grid[combination[0]])
        );
    }

    function updateGridHighlight() {
        document.querySelectorAll('.mini-grid').forEach((grid, index) => {
            grid.classList.remove('active');
            if (activeMiniGrid === -1 || activeMiniGrid === index) {
                grid.classList.add('active');
            }
        });
    }

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