var button = document.getElementById("changeColorBtn");

button.onclick = function() {
    var randomColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    document.body.style.backgroundColor = randomColor;
}

function updateDateTime() {
    var now = new Date();
    var options = { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric', 
        second: 'numeric'
    };

    var formattedDateTime = now.toLocaleString('en-US', options);
    document.getElementById('dateTimeBlock').textContent = formattedDateTime;
}

updateDateTime(); 
setInterval(updateDateTime, 1000); 

function displayGreeting() {
    const currentHour = new Date().getHours();
    let greeting;

    if (currentHour < 12) {
        greeting = "Good morning!";
    } else if (currentHour < 18) {
        greeting = "Good afternoon!";
    } else {
        greeting = "Good evening!";
    }

    alert(greeting);
}