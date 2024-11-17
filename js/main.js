function ReadMore() {
    var button = document.getElementById("more");

    button.onclick = function() {
        if (document.getElementById("text").style.display === "none" ||  document.getElementById("text").style.display === "") {
            document.getElementById("text").style.display = "inline"
        } else {
            document.getElementById("text").style.display = "none"
        }
    }
}

function resetForm() {
    document.querySelectorAll('input').forEach(input => input.value = '');
}

function validation() {
    var emailInput = document.getElementById("email").value;

    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailInput)) {
        alert("Congratulations! Your answer has been sent")
    } else {
        alert("Invalid email address! Please, try again")
    }
}

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

function setTheme(mode) {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(mode);

    localStorage.setItem('theme', mode);

    const toggleButton = document.getElementById('themeToggle');
    toggleButton.textContent = mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

window.onload = () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
};

document.getElementById('themeToggle').addEventListener('click', toggleTheme);


function checker() {
    var email = document.getElementById("emails").value

    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        alert("Congratulations! Your answer has been sent")
    } else {
        alert("Invalid email address! Please, try again")
    }
}

function creator() {
    var name = document.getElementById("creator");
    if (name.style.display === "block") {
        name.style.display = "none";
    } else {
        name.style.display = "block";
    }
}

function rights() {
    var rights = document.getElementById("rights");
    if (rights.style.display === "block") {
        rights.style.display = "none";
    } else {
        rights.style.display = "block";
    }
}

document.addEventListener('keydown', function(event) {
    const navItems = document.querySelectorAll('.navbar-nav .nav-link');
    let currentIndex = -1;

    navItems.forEach((item, index) => {
        if (document.activeElement === item) {
            currentIndex = index;
        }
    });

    if (event.key === 'ArrowDown') {
        const nextIndex = (currentIndex + 1) % navItems.length; 
        navItems[nextIndex].focus();
    } else if (event.key === 'ArrowUp') {
        const prevIndex = (currentIndex - 1 + navItems.length) % navItems.length; 
        navItems[prevIndex].focus();
    }
});

document.getElementById('playSoundButton').onclick = function() {
    const sound = document.getElementById('sound');
    sound.currentTime = 0;
    sound.play(); 
};

// Select form and output elements
const form = document.getElementById('lyricsForm');
const output = document.getElementById('output');

form.addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent the form from reloading the page

  // Get the artist and title values
  const artist = document.getElementById('artist').value.trim();
  const title = document.getElementById('title').value.trim();

  // Validate input
  if (!artist || !title) {
    output.innerHTML = '<span class="error">Please provide both artist and title.</span>';
    return;
  }

  // Fetch lyrics from the Lyrics.ovh API
  try {
    const response = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);
    
    if (response.ok) {
      const data = await response.json();
      output.textContent = data.lyrics; // Display the lyrics
    } else if (response.status === 404) {
      output.innerHTML = '<span class="error">No lyrics found.</span>';
    } else {
      output.innerHTML = '<span class="error">An error occurred. Please try again later.</span>';
    }
  } catch (error) {
    output.innerHTML = '<span class="error">Failed to fetch lyrics. Please check your connection.</span>';
  }
});
