function contact() {
    var popupForm = document.getElementById("popupForm")
    var openFormBtn = document.getElementById("openFormBtn")
    var closeFormBtn = document.getElementById("closeFormBtn")

    openFormBtn.onclick = function() {
        popupForm.style.display = "flex";
    }

    closeFormBtn.onclick = function() {
        popupForm.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target === popupForm) {
            popupForm.style.display = "none";
        }
    }
}

function checker() {
    var email = document.getElementById("emails").value

    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        alert("Congratulations! Your answer has been sent")
    } else {
        alert("Invalid email address! Please, try again")
    }
}
