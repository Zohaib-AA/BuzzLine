const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedData = jwt.verify(token, 'this_is_a_key_which_is_used_for_login');
        req.userData = { email: decodedData.email, userId: decodedData.userId }
        next();
    } catch (err) {
        res.status(401).json({
            message: 'You are not authenticated!'
        })
    }
}