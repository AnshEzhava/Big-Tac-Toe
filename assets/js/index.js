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