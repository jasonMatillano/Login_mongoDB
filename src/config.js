const mongoose = require('mongoose');
const connect = mongoose.connect('mongodb://127.0.0.1:27017/Login');

// check connection
connect.then((db) => {
    console.log('Connected correctly to database server');
}, (err) => { console.log(err) })

// create schema
const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

// collection part
const collection = new mongoose.model('users', LoginSchema);

module.exports = collection;
