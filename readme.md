# BMI Calculator Application

This is a simple BMI (Body Mass Index) Calculator web application built using Node.js and Express.js. The application allows users to enter their weight (in kilograms) and height (in meters) to calculate their BMI. Based on the BMI value, the application categorizes the result (Underweight, Normal weight, Overweight, or Obesity) and provides relevant health tips. It also validates user input to ensure accurate calculations.

## Project Structure
The project follows a clean and organized folder structure:

```
Assignment-1/
├── public/
│   └── style.css        # Stylesheet for the application
├── views/
│   └── index.html       # HTML file for the homepage
├── server.js            # Main entry point for the server
├── README.md            # Documentation for the project
```

## Functionalities
1. **Homepage:**
   - A form where users can enter their weight, height, age, and gender.
   - Form submission is routed to the `/calculate` endpoint.

2. **BMI Calculation:**
   - BMI is calculated using the formula: `BMI = weight / (height * height)`.
   - Categorizes BMI into one of four groups:
     - Below 18.5: Underweight
     - 18.5 - 24.9: Normal weight
     - 25 - 29.9: Overweight
     - 30 and above: Obesity

3. **Result Page:**
   - Displays the calculated BMI value and the corresponding category.
   - Provides health tips based on the BMI category.
   - Includes a "Go back" link to return to the homepage.

## How to Run the Application
1. **Prerequisites:**
   - Install [Node.js](https://nodejs.org/) (latest LTS version recommended).

2. **Setup:**
   - Download and extract the project folder.
   - Open a terminal and navigate to the project folder.
   - Run the following command to install dependencies:
     ```bash
     npm init -y
     npm install express body-parser
     ```

3. **Run the Server:**
   - Start the server using the following command:
     ```bash
     node server.js
     ```
   - The server will run on `http://localhost:8000`.

4. **Access the Application:**
   - Open a web browser and go to `http://localhost:8000` to access the homepage.



