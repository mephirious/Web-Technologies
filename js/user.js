// Sample user data (for demonstration only)
function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || {};
}

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('username') !== null;
}

// Login function
function login(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const users = getUsers(); // Fetch the latest user data

    if (users[username] && users[username] === password) {
        localStorage.setItem('username', username);
        alert('Login successful!');
        window.location.href = 'login.html'; // Redirect to home
    } else {
        alert('Invalid username or password');
    }
}

// Registration function
function register(event) {
    event.preventDefault();
    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;

    const users = getUsers(); // Fetch the latest user data

    if (users[newUsername]) {
        alert('Username already exists. Please choose another one.');
    } else {
        users[newUsername] = newPassword; // Add new user
        localStorage.setItem('users', JSON.stringify(users)); // Save users to localStorage
        alert('Registration successful! You can now log in.');
        document.getElementById('popupRegistration').style.display = 'none'; // Hide registration form
        document.getElementById('registerForm').reset(); // Reset the form fields
    }
}

// Logout function
function logout() {
    localStorage.removeItem('username');
    alert('You have logged out.');
    window.location.href = 'login.html'; // Redirect to login
}

// Attach event listeners to forms and links after DOM has fully loaded
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm').addEventListener('submit', login);
    document.getElementById('registerForm').addEventListener('submit', register);

    // Show/hide registration form
    const registerLink = document.getElementById('registerLink');
    registerLink.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default link behavior
        const popupRegistration = document.getElementById('popupRegistration');
        popupRegistration.style.display = 'flex'; // Show the registration pop-up
    });

    document.getElementById('closePopup').addEventListener('click', function () {
        document.getElementById('popupRegistration').style.display = 'none';
    });
});
