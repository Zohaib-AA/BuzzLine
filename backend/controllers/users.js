

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require("../models/authModel");

exports.registerUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save().then(response => {
            res.status(201).json({
                message: 'User created',
                result: response
            });
        }).catch(err => {
            res.status(404).json({
                message: 'User already exists!',
                error: err
            })
        })
    })
};

exports.loginUser = (req, res, next) => {
    let currentUser;
    User.findOne({ email: req.body.email }).then(user => {
        if (!user) {
            return res.status(404).json({
                message: 'User does not exists!'
            });
        }
        currentUser = user;
        return bcrypt.compare(req.body.password, user.password)
    }).then(result => {
        if (!result || !currentUser) {
            return res.status(404).json({
                message: 'Incorrect credentials!'
            });
        }
        const token = jwt.sign({ email: currentUser.email, userId: currentUser._id }, 'this_is_a_key_which_is_used_for_login', { expiresIn: '1h' });
        res.status(200).json({
            token: token,
            message: 'Logged-In succesfully',
            expiresIn: 3600,
            userId: currentUser._id
        })

    }).catch(err => {
        res.status(400).json({
            message: 'Some error occured!!!',
            error: err
        })
    })
}
