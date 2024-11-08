let currentPlayer = 'X';
const ultimateGrid = Array(9).fill(null).map(() => Array(9).fill(null));
const miniGridStatus = Array(9).fill(null);
let activeMiniGrid = -1;

// --- AI SETTINGS ---
const SIMULATION_COUNT = 100;  // Number of simulations per possible move

// Handles human player's move
function handleCellClick(event) {
    if (currentPlayer !== 'X') return; // Only allow clicks on human's turn

    const cell = event.target;
    const [miniGridIndex, cellIndex] = cell.dataset.index.split('-').map(Number);

    if (ultimateGrid[miniGridIndex][cellIndex] || (activeMiniGrid !== -1 && activeMiniGrid !== miniGridIndex)) {
        return; // Invalid move
    }

    makeMove(miniGridIndex, cellIndex, currentPlayer);

    if (checkWinner(miniGridStatus)) {
        document.getElementById("winner-line").textContent = `Player ${currentPlayer} wins the game!`;
        return;
    }

    currentPlayer = 'O';
    document.getElementById("info").textContent = `Current turn: ${currentPlayer}`;
    setTimeout(() => makeAIMove(), 500); // AI moves after a short delay
}

// Executes a move in the specified mini-grid and cell
function makeMove(miniGridIndex, cellIndex, player) {
    ultimateGrid[miniGridIndex][cellIndex] = player;
    if (checkWinner(ultimateGrid[miniGridIndex])) {
        miniGridStatus[miniGridIndex] = player;
        document.querySelectorAll('.mini-grid')[miniGridIndex].classList.add(`won-${player}`);
    }

    const cell = document.querySelector(`[data-index="${miniGridIndex}-${cellIndex}"]`);
    cell.textContent = player;
    cell.classList.add('filled');
    cell.classList.remove('empty');

    activeMiniGrid = miniGridStatus[cellIndex] ? -1 : cellIndex;
    updateGridHighlight();
}

// AI Move logic using Monte Carlo Tree Search
function makeAIMove() {
    const [miniGridIndex, cellIndex] = findBestMove();
    makeMove(miniGridIndex, cellIndex, currentPlayer);

    if (checkWinner(miniGridStatus)) {
        document.getElementById("winner-line").textContent = `Player ${currentPlayer} wins the game!`;
        return;
    }

    currentPlayer = 'X';
    document.getElementById("info").textContent = `Current turn: ${currentPlayer}`;
    updateGridHighlight();
}

// Monte Carlo Tree Search for AI
function findBestMove() {
    const possibleMoves = getValidMoves();
    const winCounts = Array(possibleMoves.length).fill(0);

    possibleMoves.forEach((move, i) => {
        for (let j = 0; j < SIMULATION_COUNT; j++) {
            const result = simulateRandomGame(move[0], move[1], currentPlayer);
            if (result === currentPlayer) winCounts[i]++;
        }
    });

    const bestIndex = winCounts.indexOf(Math.max(...winCounts));
    return possibleMoves[bestIndex];
}

// Simulates a random game from a given move
function simulateRandomGame(miniGridIndex, cellIndex, startingPlayer) {
    const simUltimateGrid = ultimateGrid.map(grid => grid.slice());
    const simMiniGridStatus = miniGridStatus.slice();
    let simActiveMiniGrid = activeMiniGrid;
    let player = startingPlayer;

    makeSimulatedMove(simUltimateGrid, simMiniGridStatus, miniGridIndex, cellIndex, player);

    while (!checkWinner(simMiniGridStatus)) {
        const moves = getValidMoves(simUltimateGrid, simMiniGridStatus, simActiveMiniGrid);
        if (moves.length === 0) break;
        const [simMiniGridIndex, simCellIndex] = moves[Math.floor(Math.random() * moves.length)];
        player = player === 'X' ? 'O' : 'X';
        makeSimulatedMove(simUltimateGrid, simMiniGridStatus, simMiniGridIndex, simCellIndex, player);
    }
    return player;
}

function makeSimulatedMove(simUltimateGrid, simMiniGridStatus, miniGridIndex, cellIndex, player) {
    simUltimateGrid[miniGridIndex][cellIndex] = player;
    if (checkWinner(simUltimateGrid[miniGridIndex])) {
        simMiniGridStatus[miniGridIndex] = player;
    }
}

// Valid moves based on the current game state
function getValidMoves(grid = ultimateGrid, miniGridStatusOverride = miniGridStatus, activeMiniGridOverride = activeMiniGrid) {
    const moves = [];
    const gridsToCheck = activeMiniGridOverride === -1 ? Array.from({ length: 9 }, (_, i) => i) : [activeMiniGridOverride];

    gridsToCheck.forEach(miniGridIndex => {
        if (!miniGridStatusOverride[miniGridIndex]) {
            for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
                if (!grid[miniGridIndex][cellIndex]) moves.push([miniGridIndex, cellIndex]);
            }
        }
    });
    return moves;
}

// Helper function to check winner in a grid
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

// Update grid highlights based on the active mini-grid
function updateGridHighlight() {
    document.querySelectorAll('.mini-grid').forEach((grid, index) => {
        grid.classList.remove('active');
        if (activeMiniGrid === -1 || activeMiniGrid === index) {
            grid.classList.add('active');
        }
    });
}

// Initialize cells with click events and empty classes
document.querySelectorAll('.mini-grid div').forEach((cell, index) => {
    const miniGridIndex = Math.floor(index / 9);
    const cellIndex = index % 9;
    cell.dataset.index = `${miniGridIndex}-${cellIndex}`;
    cell.addEventListener('click', handleCellClick);
    cell.classList.add('empty');
});

updateGridHighlight();
