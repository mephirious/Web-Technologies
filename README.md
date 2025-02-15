
# Blog Website

This is a simple blog website where users can register, login, and manage their blog posts. The website is built using **Node.js**, **Express**, **MongoDB**, and **EJS** for templating.

## Features

- **User Registration**: Users can sign up with a username, email, and password.
- **User Login**: Registered users can log in with their email and password.
- **Blog Management**: Users can create, edit, and view blog posts.
- **Admin Dashboard**: Admins can view and delete any blog posts.
- **Session Management**: Login sessions are managed with **Express-session**.

## Technologies Used

- **Node.js** - JavaScript runtime used for the backend.
- **Express.js** - Web framework for building the application.
- **MongoDB** - NoSQL database to store user and blog data.
- **EJS** - Templating engine used to render views.
- **Bcrypt** - Password hashing for secure login.
- **Bootstrap** - Front-end framework for styling.

## Installation

To set up the project on your local machine, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/mephirious/WebTech-Assignment-4.git
   ```

2. Navigate to the project directory:
   ```bash
   cd WebTech-Assignment-4
   ```

3. Install the required dependencies:
   ```bash
   npm install
   ```

4. Set up your MongoDB database. You can either use a local instance or MongoDB Atlas for a cloud database.

5. Create a `.env` file to store environment variables (such as MongoDB URI, session secret):
   ```
    MONGO_URI="yourenv"
    EMAIL_USER="yourenv"
    EMAIL_PAS="yourenv"`
    MAILJET_API="yourenv"
    MAILJET_SECRET="yourenv"
    ADMIN_USERNAME = "yourenv"
    ADMIN_PASSWORD = "yourenv"
   ```

6. Start the server:
   ```bash
   node server.js
   ```

7. Visit `http://localhost:3000` in your browser.

## Routes

- **GET /register** - Displays the registration page.
- **POST /register** - Handles user registration.
- **GET /login** - Displays the login page.
- **POST /login** - Handles user login.
- **GET /dashboard** - Displays the user's dashboard (requires login).
- **POST /create-blog** - Allows the user to create a new blog post.
- **GET /admin** - Admin dashboard to manage blog posts (requires admin login).
- **POST /admin/delete-blog** - Admin can delete a blog post.
