const express = require('express');

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require('path');

const postRoute = require('./posts/post');
const authRoute = require('./posts/auth');
const app = express();

mongoose.connect("mongodb+srv://Zohaib:" + process.env.MONGO_DB_ATLAS + "@clusterbuzz.3o7sr.mongodb.net/express-angular?retryWrites=true&w=majority&appName=ClusterBuzz").then(() => {
    console.log("Connected to databse");
}).catch((err) => {
    console.log(err);
    console.log("Connection failed");
});

app.use(bodyParser.json());
app.use('/images', express.static(path.join('images')));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE, PUT");
    next();
});

app.use('/api/posts', postRoute);
app.use('/api/account', authRoute);

module.exports = app;