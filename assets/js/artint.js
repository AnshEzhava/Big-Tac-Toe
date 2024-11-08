let currentPlayer = 'X';
const ultimateGrid = Array(9).fill(null).map(() => Array(9).fill(null));
const miniGridStatus = Array(9).fill(null);
let activeMiniGrid = -1;
const AI_PLAYER = 'O';
const HUMAN_PLAYER = 'X';

function handleCellClick(event) {
    if (currentPlayer === AI_PLAYER) return; // Block input if it's the AI's turn

    const cell = event.target;
    const [miniGridIndex, cellIndex] = cell.dataset.index.split('-').map(Number);

    if (ultimateGrid[miniGridIndex][cellIndex] || (activeMiniGrid !== -1 && activeMiniGrid !== miniGridIndex)) {
        return;
    }

    makeMove(miniGridIndex, cellIndex, currentPlayer);
    
    if (!checkForGameEnd()) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (currentPlayer === AI_PLAYER) {
            const aiMove = findBestMove();
            makeMove(aiMove.miniGridIndex, aiMove.cellIndex, AI_PLAYER);
            checkForGameEnd();
            currentPlayer = HUMAN_PLAYER;
        }
    }
    updateGridHighlight();
}

function makeMove(miniGridIndex, cellIndex, player) {
    ultimateGrid[miniGridIndex][cellIndex] = player;
    const cell = document.querySelector(`[data-index="${miniGridIndex}-${cellIndex}"]`);
    cell.textContent = player;
    cell.classList.add('filled');
    cell.classList.remove('empty');

    if (checkWinner(ultimateGrid[miniGridIndex])) {
        miniGridStatus[miniGridIndex] = player;
        const miniGridElement = document.querySelectorAll('.mini-grid')[miniGridIndex];
        miniGridElement.classList.add(`won-${player}`);
        miniGridElement.setAttribute('data-winner', player);
    }

    activeMiniGrid = miniGridStatus[cellIndex] ? -1 : cellIndex;
}

function checkForGameEnd() {
    if (checkWinner(miniGridStatus)) {
        document.getElementById("winner-line").textContent = `Player ${currentPlayer} wins the game!`;
        return true;
    }
    return false;
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

function findBestMove() {
    let bestScore = -Infinity;
    let bestMove = null;

    for (let miniGridIndex = 0; miniGridIndex < 9; miniGridIndex++) {
        if (miniGridStatus[miniGridIndex]) continue;
        for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
            if (!ultimateGrid[miniGridIndex][cellIndex]) {
                ultimateGrid[miniGridIndex][cellIndex] = AI_PLAYER;
                let score = minimax(ultimateGrid, 0, false, -Infinity, Infinity);
                ultimateGrid[miniGridIndex][cellIndex] = null;
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { miniGridIndex, cellIndex };
                }
            }
        }
    }
    return bestMove;
}

function minimax(board, depth, isMaximizing, alpha, beta) {
    if (checkWinner(miniGridStatus) === AI_PLAYER) return 10 - depth;
    if (checkWinner(miniGridStatus) === HUMAN_PLAYER) return depth - 10;
    if (miniGridStatus.every(status => status)) return 0; // Tie

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (let miniGridIndex = 0; miniGridIndex < 9; miniGridIndex++) {
            if (miniGridStatus[miniGridIndex]) continue;
            for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
                if (!board[miniGridIndex][cellIndex]) {
                    board[miniGridIndex][cellIndex] = AI_PLAYER;
                    let eval = minimax(board, depth + 1, false, alpha, beta);
                    board[miniGridIndex][cellIndex] = null;
                    maxEval = Math.max(maxEval, eval);
                    alpha = Math.max(alpha, eval);
                    if (beta <= alpha) return maxEval;
                }
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let miniGridIndex = 0; miniGridIndex < 9; miniGridIndex++) {
            if (miniGridStatus[miniGridIndex]) continue;
            for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
                if (!board[miniGridIndex][cellIndex]) {
                    board[miniGridIndex][cellIndex] = HUMAN_PLAYER;
                    let eval = minimax(board, depth + 1, true, alpha, beta);
                    board[miniGridIndex][cellIndex] = null;
                    minEval = Math.min(minEval, eval);
                    beta = Math.min(beta, eval);
                    if (beta <= alpha) return minEval;
                }
            }
        }
        return minEval;
    }
}

function updateGridHighlight() {
    document.querySelectorAll('.mini-grid').forEach((grid, index) => {
        grid.classList.remove('active');
        if (activeMiniGrid === -1 || activeMiniGrid === index) {
            grid.classList.add('active');
        }
    });
}

