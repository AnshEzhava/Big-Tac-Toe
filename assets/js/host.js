// Retrieve sessionId from the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get("sessionId");

const playerSymbol = "X"; // Host is always X
let currentPlayer = "X"; // Track the turn
let activeMiniGrid = -1; // The allowed mini-grid for the next move
const ultimateGrid = Array(9)
  .fill(null)
  .map(() => Array(9).fill(null));
const miniGridStatus = Array(9).fill(null); // Track who won each mini-grid

if (sessionId) {
  const socket = new WebSocket(
    `wss://bigtactoe-backend-production.up.railway.app/ws/game?sessionId=${sessionId}`
  );
  //bigtactoe-backend-production.up.railway.app
  //localhost:8080
  socket.onopen = () => {
    console.log(
      "Connected to WebSocket for game updates, session ID:",
      sessionId
    );
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const {
      miniGridIndex,
      cellIndex,
      player,
      nextTurn,
      nextActiveMiniGrid,
      type,
      winner,
      miniGridWinner,
    } = data;

    if (type === "GAME_OVER") {
      document.getElementById(
        "winner-line"
      ).textContent = `Player ${winner} wins the game!`;
      return;
    }

    console.log("Received data:", data);

    const cell = document.querySelector(
      `.mini-grid[data-index='${miniGridIndex}'] div[data-cell='${cellIndex}']`
    );
    if (cell) {
      cell.textContent = player;
      cell.classList.add("filled");
      cell.classList.remove("empty");
      currentPlayer = nextTurn;
      activeMiniGrid = nextActiveMiniGrid;
      document.getElementById(
        "info"
      ).textContent = `Current turn: ${currentPlayer}`;
      updateGridHighlight();
    }

    if (miniGridWinner) {
      miniGridStatus[miniGridIndex] = miniGridWinner;
      const miniGridElement =
        document.querySelectorAll(".mini-grid")[miniGridIndex];
      miniGridElement.classList.add(`won-${miniGridWinner}`);
      miniGridElement.setAttribute("data-winner", miniGridWinner);
    }
  };

  socket.onclose = () => {
    console.log("Disconnected from WebSocket");
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  window.onbeforeunload = function () {
    // Notify the guest that the host is leaving
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          event: "host-leaving",
          message: "The host has left the game. Redirecting to the main page.",
        })
      );
    }
    window.location.href = "index.html";
  };
  function redirectGuest() {
    window.location.href = "index.html";
  }

  socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    if (data.event === "host-leaving") {
      console.log("Host has left, redirecting the guest.");
      redirectGuest();
    }
  };

  function handleCellClick(event) {
    if (currentPlayer !== playerSymbol) {
      console.log("Not your turn!");
      return;
    }

    const cell = event.target;
    const [miniGridIndex, cellIndex] = cell.dataset.index
      .split("-")
      .map(Number);

    if (
      ultimateGrid[miniGridIndex][cellIndex] ||
      (activeMiniGrid !== -1 && activeMiniGrid !== miniGridIndex)
    ) {
      return;
    }

    ultimateGrid[miniGridIndex][cellIndex] = playerSymbol;
    cell.textContent = playerSymbol;
    cell.classList.add("filled");
    cell.classList.remove("empty");

    let miniGridWinner = null;

    if (checkMiniGridWinner(ultimateGrid[miniGridIndex])) {
      miniGridStatus[miniGridIndex] = playerSymbol;
      const miniGridElement =
        document.querySelectorAll(".mini-grid")[miniGridIndex];
      miniGridElement.classList.add(`won-${currentPlayer}`);
      miniGridElement.setAttribute("data-winner", playerSymbol);
      miniGridWinner = playerSymbol;

      if (checkUltimateGridWinner()) {
        document.getElementById(
          "winner-line"
        ).textContent = `Player ${playerSymbol} wins the game!`;

        const moveData = {
          miniGridIndex,
          cellIndex,
          player: playerSymbol,
          nextTurn: null,
          nextActiveMiniGrid: null,
          sessionId: sessionId,
          miniGridWinner: miniGridWinner,
          type: "GAME_OVER",
          winner: playerSymbol,
        };
        socket.send(JSON.stringify(moveData));
        return;
      }
    }

    const nextTurn = playerSymbol === "X" ? "O" : "X";
    activeMiniGrid = cellIndex;
    if (miniGridStatus[activeMiniGrid]) activeMiniGrid = -1;

    const moveData = {
      miniGridIndex,
      cellIndex,
      player: playerSymbol,
      nextTurn,
      nextActiveMiniGrid: activeMiniGrid,
      sessionId: sessionId,
      miniGridWinner: miniGridWinner,
    };
    console.log("Sending move data:", moveData);
    socket.send(JSON.stringify(moveData));

    currentPlayer = nextTurn;
    document.getElementById(
      "info"
    ).textContent = `Current turn: ${currentPlayer}`;
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

  function checkMiniGridWinner(grid) {
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

  function checkUltimateGridWinner() {
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
        (index) =>
          miniGridStatus[index] &&
          miniGridStatus[index] === miniGridStatus[combination[0]]
      )
    );
  }

  document.querySelectorAll(".mini-grid div").forEach((cell, index) => {
    const miniGridIndex = Math.floor(index / 9);
    const cellIndex = index % 9;
    cell.dataset.index = `${miniGridIndex}-${cellIndex}`;
    cell.addEventListener("click", handleCellClick);
    cell.classList.add("empty");
  });

  updateGridHighlight();
} else {
  console.error("sessionId parameter is missing in the URL");
}
