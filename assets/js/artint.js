let currentPlayer = "X"; // "X" for player, "O" for AI
const ultimateGrid = Array(9)
  .fill(null)
  .map(() => Array(9).fill(null));
const miniGridStatus = Array(9).fill(null);
let activeMiniGrid = -1;
const AI_PLAYER = "O";
const HUMAN_PLAYER = "X";

// Handles player's move and triggers AI if it's the AI's turn
function handleCellClick(event) {
  if (currentPlayer === AI_PLAYER) return; // Ignore if it's AI's turn

  const cell = event.target;
  const [miniGridIndex, cellIndex] = cell.dataset.index.split("-").map(Number);

  if (
    ultimateGrid[miniGridIndex][cellIndex] || // Cell is already filled
    (activeMiniGrid !== -1 && activeMiniGrid !== miniGridIndex)
  ) {
    return; // Invalid move
  }

  makeMove(miniGridIndex, cellIndex, HUMAN_PLAYER);

  if (!checkForGameEnd()) {
    currentPlayer = AI_PLAYER;
    const aiMove = findBestMove();
    if (aiMove) {
      makeMove(aiMove.miniGridIndex, aiMove.cellIndex, AI_PLAYER);
      checkForGameEnd();
      currentPlayer = HUMAN_PLAYER;
    }
  }
  updateGridHighlight();
}

// Execute a move for the given player and update board state
function makeMove(miniGridIndex, cellIndex, player) {
  ultimateGrid[miniGridIndex][cellIndex] = player;
  const cell = document.querySelector([data-index="${miniGridIndex}-${cellIndex}"]);
  cell.textContent = player;
  cell.classList.add("filled");
  cell.classList.remove("empty");

  if (checkWinner(ultimateGrid[miniGridIndex])) {
    miniGridStatus[miniGridIndex] = player;
    const miniGridElement = document.querySelectorAll(".mini-grid")[miniGridIndex];
    miniGridElement.classList.add(won-${player});
    miniGridElement.setAttribute("data-winner", player);
  }

  activeMiniGrid = miniGridStatus[cellIndex] ? -1 : cellIndex;
}

// Check for end of game and declare winner if applicable
function checkForGameEnd() {
  if (checkWinner(miniGridStatus)) {
    document.getElementById("winner-line").textContent = Player ${currentPlayer} wins the game!;
    return true;
  }
  return false;
}

// Minimax function with Alpha-Beta pruning for AI decision-making
function findBestMove() {
  let bestScore = -Infinity;
  let bestMove = null;

  for (let miniGridIndex = 0; miniGridIndex < 9; miniGridIndex++) {
    if (miniGridStatus[miniGridIndex]) continue;
    for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
      if (!ultimateGrid[miniGridIndex][cellIndex]) {
        ultimateGrid[miniGridIndex][cellIndex] = AI_PLAYER;
        const score = minimax(ultimateGrid, miniGridStatus, 3, -Infinity, Infinity, false);
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

function minimax(board, miniGridStatus, depth, alpha, beta, isMaximizing) {
  if (depth === 0 || checkForGameEnd()) {
    return evaluateBoard(board);
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let miniGridIndex = 0; miniGridIndex < 9; miniGridIndex++) {
      if (miniGridStatus[miniGridIndex]) continue;
      for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
        if (!board[miniGridIndex][cellIndex]) {
          board[miniGridIndex][cellIndex] = AI_PLAYER;
          const eval = minimax(board, miniGridStatus, depth - 1, alpha, beta, false);
          board[miniGridIndex][cellIndex] = null;
          maxEval = Math.max(maxEval, eval);
          alpha = Math.max(alpha, eval);
          if (beta <= alpha) break;
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
          const eval = minimax(board, miniGridStatus, depth - 1, alpha, beta, true);
          board[miniGridIndex][cellIndex] = null;
          minEval = Math.min(minEval, eval);
          beta = Math.min(beta, eval);
          if (beta <= alpha) break;
        }
      }
    }
    return minEval;
  }
}

// Basic evaluation function to score the board state for the AI
function evaluateBoard(board) {
  let score = 0;
  // Add logic here to evaluate the board's current state.
  // A positive score favors the AI, and a negative score favors the human.
  // Example scoring: 10 for each row, column, or diagonal where AI is winning.
  return score;
}

// Helper function to check for a winning condition
function checkWinner(grid) {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  return winningCombinations.some((combination) =>
    combination.every(
      (index) => grid[index] && grid[index] === grid[combination[0]]
    )
  );
}

// Highlight active mini-grid
function updateGridHighlight() {
  document.querySelectorAll(".mini-grid").forEach((grid, index) => {
    grid.classList.remove("active");
    if (activeMiniGrid === -1 || activeMiniGrid === index) {
      grid.classList.add("active");
    }
  });
}

// Initialize event listeners for each cell in the grid
document.querySelectorAll(".mini-grid div").forEach((cell, index) => {
  const miniGridIndex = Math.floor(index / 9);
  const cellIndex = index % 9;
  cell.dataset.index = ${miniGridIndex}-${cellIndex};
  cell.addEventListener("click", handleCellClick);
  cell.classList.add("empty");
});

updateGridHighlight();