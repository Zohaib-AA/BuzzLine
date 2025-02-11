const express = require('express');

const authRoute = express.Router();

const UserController = require('../controllers/users');

authRoute.post('/register', UserController.registerUser);

authRoute.post('/login', UserController.loginUser);

module.exports = authRoute;