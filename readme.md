# User Management Application

This is a simple User Management web application built using Node.js, Express.js, and MongoDB. The application allows administrators to view, filter, sort, and manage users by name, email, and age. The users' information is stored in a MongoDB database, and the application supports searching and sorting functionality to help manage large datasets efficiently.

## Project Structure

The project follows a clean and organized folder structure:

```
User-Management-App/
├── public/
│   └── style.css          
├── views/
│   └── index.ejs     
│   └── edit.ejs   
│   └── add.ejs   
├── server.js
└── README.md               
```

## Functionalities

   - Displays a list of users with their name, email, and age.
   - A search and filter form that allows filtering by name, email, and age.
   - Sorting functionality to sort users by name, email, or age in ascending or descending order.

## How to Run the Application

1. **Prerequisites:**
   - Install [Node.js](https://nodejs.org/) 
   - Install [MongoDB](https://www.mongodb.com/try/download/community) 
   
2. **Setup:**
   - Download and extract the project folder.
   - Open a terminal and navigate to the project folder.
   - Run the following command to install dependencies:
     ```bash
     npm init -y
     npm install express mongoose body-parser ejs
     ```

3. **Run the Server:**
   - Start the server using the following command:
     ```bash
     node app.js
     ```
   - The server will run on `http://localhost:3000`.

4. **Access the Application:**
   - Open a web browser and go to `http://localhost:3000` to access the homepage.