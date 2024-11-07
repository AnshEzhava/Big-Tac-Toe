function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    sessionId: params.get("sessionId"),
  };
}

const { sessionId } = getQueryParams();

if (!sessionId) {
  console.error("Session ID not found in URL");
  document.getElementById("joinStatus").textContent =
    "Session ID not found in URL.";
} else {
  console.log("Session ID:", sessionId);

  const joinButton = document.getElementById("joinGameButton");
  const joinStatus = document.getElementById("joinStatus");

  joinButton.addEventListener("click", () => {
    fetch(`http://localhost:8080/api/games/join/${sessionId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: "",
    })
      .then((response) => {
        if (response.ok) {
          window.location.href = `guest.html?sessionId=${sessionId}`;
        } else if (response.status === 400) {
          joinStatus.textContent = "Game session is not available for joining.";
        } else if (response.status === 404) {
          joinStatus.textContent = "Game session not found.";
        }
      })
      .catch((error) => {
        console.error("Error joining game: ", error);
        joinStatus.textContent = "An error occurred. Please try again.";
      });
  });
}
