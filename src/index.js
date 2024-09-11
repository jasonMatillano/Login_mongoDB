const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require('./config');

const app = express();

// convert data to json
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

// use ejs view engine
app.set('view engine', 'ejs');
// static file
app.use(express.static("public"));


app.get('/', (req, res) => {
    res.render('login');
})

app.get('/signup', (req, res) => {
    res.render('signup');
})

// register user
app.post('/signup', async (req, res) => {

    const data = {
        name: req.body.name,
        password: req.body.password
    }

    // check if user exists
    const existingUser = await collection.findOne({ name: data.name });

    if (existingUser) {
        res.send('User already exists');
        return;
    } else {
        // hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;

        const userdata = await collection.insertMany(data);

        console.log(userdata);
        res.render('login');
    }

    // Login user here
    app.post('/login', async (req, res) => {
        try {
            // check if user exists
            const user = await collection.findOne({ name: req.body.name });
            if (!user) {
                res.send('User does not exist');
            }

            //compare hash password from database with plain text
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (validPassword) {
                res.render('home');
            } else {
                res.send('Invalid password');
            }
        } catch (error) {
            res.send("wrong details")
        }
    })

})

const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})