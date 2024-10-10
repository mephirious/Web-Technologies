function validation() {
    var emailInput = document.getElementById("email").value;

    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailInput)) {
        alert("Congratulations! Your answer has been sent")
    } else {
        alert("Invalid email address! Please, try again")
    }
}

