const button = document.getElementById("online-btn");

button.addEventListener('mouseover', function() {
    button.textContent = "Under Development"
})

button.addEventListener('mouseout', function(){
    button.textContent = "Online Mode"
})

button.addEventListener('click', function(){
    return;
})

function createGameSession(){
    fetch('/api/create-session', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("sessionLink").innerHTML = `Game session created! <a href="${data.url}">${data.url}</a>`;
    });
}