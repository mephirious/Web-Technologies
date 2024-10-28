// main.js

// Sample user data (for demonstration only)
const users = JSON.parse(localStorage.getItem('users')) || {};

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('username') !== null;
}

// Login function
function login(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (users[username] && users[username] === password) {
        localStorage.setItem('username', username);
        alert('Login successful!');
        window.location.href = 'index.html'; // Redirect to home
    } else {
        alert('Invalid username or password');
    }
}

// Registration function
function register(event) {
    event.preventDefault();
    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;

    if (users[newUsername]) {
        alert('Username already exists. Please choose another one.');
    } else {
        users[newUsername] = newPassword; // Add new user
        localStorage.setItem('users', JSON.stringify(users)); // Save users to localStorage
        alert('Registration successful! You can now log in.');
        document.getElementById('registration').style.display = 'none'; // Hide registration form
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
        const registrationDiv = document.getElementById('registration');
        registrationDiv.style.display = registrationDiv.style.display === 'none' ? 'block' : 'none'; // Toggle visibility
    });

});