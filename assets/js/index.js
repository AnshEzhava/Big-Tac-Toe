const button = document.getElementById("online-btn");

button.addEventListener('mouseover', function() {
    button.textContent = "Under Development";
});

button.addEventListener('mouseout', function(){
    button.textContent = "Online Mode";
});

button.addEventListener('click', createGame);

function createGame() {
    fetch('http://localhost:8080/api/games/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ status: 'OPEN' })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Failed to create game session");
        }
    })
    .then(data => {
        const sessionId = data.id;
        if (sessionId) {
            window.location.href = `waiting.html?sessionId=${sessionId}`;
        } else {
            console.error("Session ID not found in response");
        }
    })
    .catch(error => console.error("Error creating game: ", error));
}
