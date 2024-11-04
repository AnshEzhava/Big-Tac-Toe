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