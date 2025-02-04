const express = require('express');

const authRoute = express.Router();
const bcrypt = require('bcrypt');

const User = require("../models/authModel");



authRoute.post('/login', (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save().then(response=>{
            res.status(201).json({
                message: 'User created',
                result: response
            });
        }).catch(err=>{
            res.status(404).json({
                message: 'Error countered'
            })
        })
    })
})

module.exports = authRoute;