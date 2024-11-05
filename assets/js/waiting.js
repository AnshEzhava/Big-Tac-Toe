const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('sessionId');
const gameLink = `${window.location.origin}/join.html?sessionId=${sessionId}`;

document.getElementById('session-link').textContent = gameLink;

const copyLinkButton = document.getElementById("copyLinkButton");
copyLinkButton.addEventListener('click', () => {
    navigator.clipboard.writeText(gameLink).then(() => {
        alert("Game link copied to clipboard! Share it with your friend.");
    }).catch(err => {
        console.error("Failed to copy: ", err);
    });
});

function checkGameStatus(){
    fetch(`http://localhost:8080/api/games/status/${sessionId}`)
    .then(resonse => resonse.json)
    .then(status => {
        if(status == "PLAYING"){
            window.location.href(`game.html?sessionId=${sessionId}`);
        } else {
            document.getElementById("statusMessage").textContent = `Game Session Status: ${status}`;
        }
    })
    .catch(error => console.error("Error checking game status cuz you are fukcing dumb", error));
}

setInterval(checkGameStatus, 3000);