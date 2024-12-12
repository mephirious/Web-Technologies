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
                <div class="tips">
                    <div class="tip-category underweight ${result === 'Underweight' ? 'show' : ''}">
                        <ul>
                            <li>Increase Caloric Intake: Focus on nutrient-dense foods.</li>
                            <li>Eat Frequent, Smaller Meals: Aim for 5-6 small meals a day.</li>
                            <li>Exercise: Engage in strength training exercises to build muscle mass.</li>
                            <li>Consult a Healthcare Provider: To rule out underlying health conditions.</li>
                        </ul>
                    </div>

                    <div class="tip-category normalweight ${result === 'Normal weight' ? 'show' : ''}">
                        <ul>
                            <li>Maintain a Balanced Diet: Include a variety of healthy foods.</li>
                            <li>Stay Active: Engage in regular physical activity.</li>
                            <li>Monitor Weight Regularly: Prevent gradual weight gain.</li>
                        </ul>
                    </div>

                    <div class="tip-category overweight ${result === 'Overweight' ? 'show' : ''}">
                        <ul>
                            <li>Balanced Diet: Focus on reducing calorie intake with healthy foods.</li>
                            <li>Increase Physical Activity: Aim for at least 150 minutes of exercise per week.</li>
                            <li>Set Realistic Weight Loss Goals: Aim for gradual weight loss.</li>
                            <li>Stay Hydrated: Drink water before meals to reduce calorie intake.</li>
                        </ul>
                    </div>

                    <div class="tip-category obesity ${result === 'Obesity' ? 'show' : ''}">
                        <ul>
                            <li>Consult a Healthcare Provider: Get a personalized weight loss plan.</li>
                            <li>Create a Calorie Deficit: Reduce calorie intake and focus on whole foods.</li>
                            <li>Increase Physical Activity: Incorporate cardiovascular and strength exercises.</li>
                            <li>Focus on Portion Control: Avoid overeating by using smaller plates.</li>
                        </ul>
                    </div>
                </div>
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
