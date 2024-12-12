const express = require('express'); 
const bodyParser = require('body-parser'); 

const app = express();

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static('public')); 

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.post('/calculate', (req, res) => {
    const weight = parseFloat(req.body.weight);
    const height = parseFloat(req.body.height);
    var BMI =  Math.round((weight / (height * height)) * 10) / 10;
    var result;

    if (BMI < 18.5) {
        result = 'Underweight';
    } else if (BMI >= 18.5 && BMI <= 24.9) {
        result = 'Normal weight';
    } else if (BMI >= 25 && BMI <= 29.9) {
        result = 'Overweight';
    } else if (BMI >= 30) {
        result = 'Obesity';
    }

    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        return res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="./styles.css">
                <title>Error</title>
            </head>
            <body>
                <h1>BMI Calculator</h1>
                <div class="fail">
                    <p>Invalid input: Please enter positive numbers</p>
                </div>
                <a href="/">Go back</a> 
            </body>
            </html>
        `);
    }

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Result</title>
            <link rel="stylesheet" href="/styles.css">
        </head>
        <body>
            <h1>BMI Calculator</h1>
            <div class="success">
                <p>Your BMI: ${BMI} - ${result}</p>
            </div>
            <a href="/">Go back</a> 
        </body>
        </html>
    `);
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
