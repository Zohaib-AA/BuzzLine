const express = require('express');

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require('path');

const postRoute = require('./posts/post');
const app = express();

mongoose.connect("mongodb+srv://Zohaib:l9OSdSAmYUVYuGJ3@clusterbuzz.3o7sr.mongodb.net/express-angular?retryWrites=true&w=majority&appName=ClusterBuzz").then(() => {
    console.log("Connected to databse");
}).catch((err) => {
    console.log(err);
    console.log("Connection failed");
});

app.use(bodyParser.json());
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE, PUT");
    next();
});

app.use('/api/posts', postRoute);

module.exports = app;