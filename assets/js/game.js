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

    if (checkWinner(ultimateGrid[miniGridIndex])) {
        miniGridStatus[miniGridIndex] = currentPlayer;
        document.querySelectorAll('.mini-grid')[miniGridIndex].classList.add(`won-${currentPlayer}`);
    }

    if (checkWinner(miniGridStatus)) {
        alert(`Player ${currentPlayer} wins the game!`);
        resetGame();
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    activeMiniGrid = cellIndex;
    if (miniGridStatus[activeMiniGrid]) activeMiniGrid = -1;

    updateGridHighlight();
}

function checkWinner(grid) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    return winningCombinations.some(combination =>
        combination.every(index => grid[index] && grid[index] === grid[combination[0]])
    );
}

function resetGame() {
    currentPlayer = 'X';
    ultimateGrid.forEach(miniGrid => miniGrid.fill(null));
    miniGridStatus.fill(null);
    activeMiniGrid = -1;
    document.querySelectorAll('.mini-grid div').forEach(cell => cell.textContent = '');
    document.querySelectorAll('.mini-grid').forEach(grid => grid.className = 'mini-grid');
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

document.querySelectorAll('.mini-grid div').forEach((cell, index) => {
    const miniGridIndex = Math.floor(index / 9);
    const cellIndex = index % 9;
    cell.dataset.index = `${miniGridIndex}-${cellIndex}`;
    cell.addEventListener('click', handleCellClick);
});

updateGridHighlight();