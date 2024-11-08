let currentPlayer = "X";
const ultimateGrid = Array(9)
  .fill(null)
  .map(() => Array(9).fill(null));
const miniGridStatus = Array(9).fill(null);
let activeMiniGrid = -1;
const SIMULATION_COUNT = 100;

function handleCellClick(event) {
  if (currentPlayer !== "X") return;

  const cell = event.target;
  const [miniGridIndex, cellIndex] = cell.dataset.index.split("-").map(Number);

  if (
    ultimateGrid[miniGridIndex][cellIndex] ||
    (activeMiniGrid !== -1 && activeMiniGrid !== miniGridIndex)
  ) {
    return; // Invalid move
  }

  makeMove(miniGridIndex, cellIndex, currentPlayer);

  if (checkWinner(miniGridStatus)) {
    document.getElementById("winner-line").textContent = `Player ${currentPlayer} wins the game!`;
    return;
  }

  currentPlayer = "O";
  document.getElementById("info").textContent = `Current turn: ${currentPlayer}`;
  setTimeout(() => makeAIMove(), 500);
}

function makeMove(miniGridIndex, cellIndex, player) {
  ultimateGrid[miniGridIndex][cellIndex] = player;
  const cell = document.querySelector(`[data-index="${miniGridIndex}-${cellIndex}"]`);
  cell.textContent = player;
  cell.classList.add("filled");
  cell.classList.remove("empty");

  if (checkWinner(ultimateGrid[miniGridIndex])) {
    miniGridStatus[miniGridIndex] = player;
    const miniGridElement = document.querySelectorAll(".mini-grid")[miniGridIndex];
    miniGridElement.classList.add(`won-${player}`);
    miniGridElement.setAttribute("data-winner", player);
  }

  activeMiniGrid = miniGridStatus[cellIndex] ? -1 : cellIndex;
  updateGridHighlight();
}

function makeAIMove() {
  const [miniGridIndex, cellIndex] = findBestMove();
  makeMove(miniGridIndex, cellIndex, currentPlayer);

  if (checkWinner(miniGridStatus)) {
    document.getElementById("winner-line").textContent = `Player ${currentPlayer} wins the game!`;
    return;
  }

  currentPlayer = "X";
  document.getElementById("info").textContent = `Current turn: ${currentPlayer}`;
  updateGridHighlight();
}

function findBestMove() {
  const possibleMoves = getValidMoves();
  const randomIndex = Math.floor(Math.random() * possibleMoves.length);
  return possibleMoves[randomIndex];
}

function getValidMoves() {
  const moves = [];
  const gridsToCheck = activeMiniGrid === -1 ? Array.from({ length: 9 }, (_, i) => i) : [activeMiniGrid];

  gridsToCheck.forEach(miniGridIndex => {
    if (!miniGridStatus[miniGridIndex]) {
      for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
        if (!ultimateGrid[miniGridIndex][cellIndex]) {
          moves.push([miniGridIndex, cellIndex]);
        }
      }
    }
  });

  return moves;
}

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

function resetGame() {
  currentPlayer = "X";
  ultimateGrid.forEach((miniGrid) => miniGrid.fill(null));
  miniGridStatus.fill(null);
  activeMiniGrid = -1;
  document.querySelectorAll(".mini-grid div").forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("filled");
    cell.classList.add("empty");
  });
  document.querySelectorAll(".mini-grid").forEach((grid) => (grid.className = "mini-grid"));
  updateGridHighlight();
}

function updateGridHighlight() {
  document.querySelectorAll(".mini-grid").forEach((grid, index) => {
    grid.classList.remove("active");
    if (activeMiniGrid === -1 || activeMiniGrid === index) {
      grid.classList.add("active");
    }
  });
}

document.querySelectorAll(".mini-grid div").forEach((cell, index) => {
  const miniGridIndex = Math.floor(index / 9);
  const cellIndex = index % 9;
  cell.dataset.index = `${miniGridIndex}-${cellIndex}`;
  cell.addEventListener("click", handleCellClick);
  cell.classList.add("empty");
});

updateGridHighlight();