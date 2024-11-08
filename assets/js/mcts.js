class MCTSNode {
    constructor(state, parent = null, move = null) {
        this.state = state;          // Current game state for this node
        this.parent = parent;        // Parent node
        this.move = move;            // The move that led to this state
        this.children = [];          // List of child nodes
        this.wins = 0;               // Win count for this node
        this.visits = 0;             // Visit count for this node
        this.untriedMoves = getValidMoves(state);  // Moves that haven't been tried yet
    }

    // UCB1 formula for node selection
    getUCB1() {
        return this.visits === 0 ? Infinity : 
               (this.wins / this.visits) + Math.sqrt(2 * Math.log(this.parent.visits) / this.visits);
    }

    // Choose the child node with the highest UCB1 score
    selectChild() {
        return this.children.reduce((bestChild, child) => child.getUCB1() > bestChild.getUCB1() ? child : bestChild);
    }

    // Add a new child node
    addChild(move, state) {
        const child = new MCTSNode(state, this, move);
        this.untriedMoves = this.untriedMoves.filter(m => m !== move);  // Remove tried move
        this.children.push(child);
        return child;
    }

    // Update node statistics after a simulation
    update(result) {
        this.visits += 1;
        if (result === this.state.currentPlayer) this.wins += 1;
    }
}

class MCTS {
    constructor(simulationLimit = 100) {
        this.simulationLimit = simulationLimit;
    }

    search(initialState) {
        const root = new MCTSNode(initialState);

        for (let i = 0; i < this.simulationLimit; i++) {
            let node = root;

            // 1. Selection: Traverse the tree until an unexpanded node is reached
            while (node.untriedMoves.length === 0 && node.children.length > 0) {
                node = node.selectChild();
            }

            // 2. Expansion: Expand a new child node from untried moves
            if (node.untriedMoves.length > 0) {
                const move = randomChoice(node.untriedMoves);
                const newState = applyMove(node.state, move);
                node = node.addChild(move, newState);
            }

            // 3. Simulation: Simulate from this node until game ends
            const result = this.simulateRandomGame(node.state);

            // 4. Backpropagation: Update statistics up the tree
            while (node !== null) {
                node.update(result);
                node = node.parent;
            }
        }

        // Choose the move with the most visits
        return root.children.reduce((bestChild, child) => child.visits > bestChild.visits ? child : bestChild).move;
    }

    simulateRandomGame(state) {
        let simState = deepCloneState(state);
        let player = simState.currentPlayer;

        while (!checkWinner(simState.miniGridStatus)) {
            const moves = getValidMoves(simState);
            if (moves.length === 0) break; // Draw if no moves are left
            const move = randomChoice(moves);
            simState = applyMove(simState, move);
            player = player === 'X' ? 'O' : 'X';
        }

        return player;
    }
}

// Helper Functions
function getValidMoves(state) {
    const moves = [];
    const gridsToCheck = state.activeMiniGrid === -1 ? Array.from({ length: 9 }, (_, i) => i) : [state.activeMiniGrid];

    gridsToCheck.forEach(miniGridIndex => {
        if (!state.miniGridStatus[miniGridIndex]) {
            for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
                if (!state.ultimateGrid[miniGridIndex][cellIndex]) moves.push([miniGridIndex, cellIndex]);
            }
        }
    });
    return moves;
}

function applyMove(state, move) {
    const [miniGridIndex, cellIndex] = move;
    const newState = deepCloneState(state);
    newState.ultimateGrid[miniGridIndex][cellIndex] = newState.currentPlayer;

    // Check if move results in a win for the mini-grid
    if (checkWinner(newState.ultimateGrid[miniGridIndex])) {
        newState.miniGridStatus[miniGridIndex] = newState.currentPlayer;
    }

    newState.currentPlayer = newState.currentPlayer === 'X' ? 'O' : 'X';
    newState.activeMiniGrid = newState.miniGridStatus[cellIndex] ? -1 : cellIndex;
    return newState;
}

function deepCloneState(state) {
    return {
        ultimateGrid: state.ultimateGrid.map(row => row.slice()),
        miniGridStatus: state.miniGridStatus.slice(),
        activeMiniGrid: state.activeMiniGrid,
        currentPlayer: state.currentPlayer
    };
}

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// The AI would be triggered like this in your main game code:
function makeAIMove() {
    const mcts = new MCTS(100); // Limit to 100 simulations for speed
    const move = mcts.search({
        ultimateGrid,
        miniGridStatus,
        activeMiniGrid,
        currentPlayer
    });
    handleCellClick({ target: document.querySelector(`[data-index="${move[0]}-${move[1]}"]`) });
}
