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

    if (checkWinner(ultimateGrid[miniGridIndex])) {
        miniGridStatus[miniGridIndex] = currentPlayer;
        const miniGridElement = document.querySelectorAll('.mini-grid')[miniGridIndex];
        miniGridElement.classList.add(`won-${currentPlayer}`);
        miniGridElement.setAttribute('data-winner', currentPlayer);
    }

    if (checkWinner(miniGridStatus)) {
        // alert(`Player ${currentPlayer} wins the game!`);
        document.getElementById("winner-line").textContent = `Player ${currentPlayer} wins the game!`
        // resetGame();
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    // Code to display current player.
    if(currentPlayer == `X`){
        document.getElementById("info").textContent = `Current turn: X`
    } else {
        document.getElementById("info").textContent = `Current turn: O`
    }


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

function resetGame() {
    currentPlayer = 'X';
    ultimateGrid.forEach(miniGrid => miniGrid.fill(null));
    miniGridStatus.fill(null);
    activeMiniGrid = -1;
    document.querySelectorAll('.mini-grid div').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('filled');
        cell.classList.add('empty');
    });
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
    cell.classList.add('empty');
});

updateGridHighlight();