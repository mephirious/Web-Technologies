const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public')); 

mongoose.connect('mongodb://127.0.0.1:27017/assignment3', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number,
});

const User = mongoose.model('User', userSchema);

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', async (req, res) => {
    try {
        const { searchName, searchEmail, searchAge, sortBy = 'name', order = 'asc' } = req.query;
        const query = {};

        if (searchName) {
            query.name = { $regex: searchName, $options: 'i' }; 
        }
        if (searchEmail) {
            query.email = { $regex: searchEmail, $options: 'i' }; 
        }
        if (searchAge) {
            query.age = searchAge;
        }

        const sortOrder = order === 'asc' ? 1 : -1; 

        const users = await User.find(query)
            .sort({ [sortBy]: sortOrder }); 

        res.render('index', {
            users,
            message: users.length ? '' : 'No users found.',
            searchName,
            searchEmail,
            searchAge,
            order,
            sortBy,
        });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send('Error loading home page');
    }
});

app.get('/add', (req, res) => {
    res.render('add', { errors: [] });
});

app.post('/add', async (req, res) => {
    const { name, email, age } = req.body;

    const errors = [];

    if (!name || name.length < 3 || name.length > 50) {
        errors.push('Name must be between 3 and 50 characters.');
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        errors.push('Invalid email format.');
    }
    if (!age || isNaN(age) || age < 1 || age > 120) {
        errors.push('Age must be a number between 1 and 120.');
    }

    if (errors.length > 0) {
        return res.status(400).render('add', {
            errors,
            name,
            email,
            age,
        });
    }

    try {
        const { name, email, age } = req.body;
        const newUser = new User({ name, email, age });
        await newUser.save();
        res.redirect('/');
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).send('Error creating user');
    }
});

app.get('/edit/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.render('add', { errors: [] });
    } catch (err) {
        console.error('Error fetching user for editing:', err);
        res.status(500).send('Error fetching user for editing');
    }
});

app.post('/edit/:id', async (req, res) => {
    const { name, email, age } = req.body;
    const { id } = req.params;

    const errors = [];

    if (!name || name.length < 3 || name.length > 50) {
        errors.push('Name must be between 3 and 50 characters.');
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        errors.push('Invalid email format.');
    }
    if (!age || isNaN(age) || age < 1 || age > 120) {
        errors.push('Age must be a number between 1 and 120.');
    }

    if (errors.length > 0) {
        return res.status(400).render('edit', {
            errors,
            name,
            email,
            age,
            userId: id,
        });
    }

    try {
        await User.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/');
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).send('Error updating user');
    }
});

app.post('/delete/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Error deleting user');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
