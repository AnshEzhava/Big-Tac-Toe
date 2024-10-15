const button = document.getElementById("online-btn");

button.addEventListener('mouseover', function() {
    button.textContent = "Under Development";
});

button.addEventListener('mouseout', function(){
    button.textContent = "Online Mode";
});

// Pass the function reference without calling it
button.addEventListener('click', createGame);

function createGame() {
    fetch('http://localhost:8080/api/games/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({player1 : 'PlayerOne'})
    })
    .then(response => response.json()) // Call .json() as a function to parse the response
    .then(data => {
        const sessionId = data.id;
        if (sessionId) { // Ensure sessionId exists
            window.location.href = `waiting.html?sessionId=${sessionId}`;
        } else {
            console.error("Session ID not found in response");
        }
    })
    .catch(error => console.error("Error creating game: ", error));
}