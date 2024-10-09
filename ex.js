var emailInput = document.getElementById("email");
var successMessage = document.getElementById("successMessage");
var dangerMessage = document.getElementById("successMessage");
var form = document.querySelector("form");

form.addEventListener("submit", function(event) {
    event.preventDefault(); 
    
    if (emailInput.checkValidity()) {
        successMessage.style.display = "block";
    } else {
        dangerMessage.style.display = "block";
    }
});

