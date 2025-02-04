const express = require('express');

const authRoute = express.Router();
const bcrypt = require('bcrypt');

const User = require("../models/authModel");



authRoute.post('/register', (req, res, next) => {
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
});

authRoute.post('/login', (req, res, next)=>{
    User.findOne({email: req.body.email}).then(user=>{
      if(!user){
        res.status(404).json({
            message: 'User not found'
        });
    }  
    return bcrypt.compare(req.body.password, user.password)
    }).then(result=>{

    }).catch(err=>{
        res.status(400).json({
            message: 'Some error occured',
            error: err
        })
    })
})

module.exports = authRoute;