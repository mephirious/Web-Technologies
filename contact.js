var openFormBtn = document.getElementById("openFormBtn");
var popupForm = document.getElementById("popupForm");
var closeFormBtn = document.getElementById("closeFormBtn");

openFormBtn.onclick = function() {
    popupForm.style.display = "flex";
};

closeFormBtn.onclick = function() {
    popupForm.style.display = "none";
};

window.onclick = function(event) {
    if (event.target === popupForm) {
        popupForm.style.display = "none";
    }
};

const contactForm = document.getElementById("contactForm");
contactForm.onsubmit = function(event) {
    event.preventDefault(); 
    alert("Thanks for contact!");
    popupForm.style.display = "none";
};
