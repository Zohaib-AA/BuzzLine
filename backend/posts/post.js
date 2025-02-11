const express = require('express');
const postRoute = express.Router();

const pageRoute = require('./paginator');

const valAuth = require('../middleware/validate-auth');
const fileAuth = require('../middleware/file-auth');

const PostController = require('../controllers/posts');


postRoute.post('', valAuth, fileAuth, PostController.createPost);

postRoute.delete('/:id', valAuth, PostController.deletePost);

postRoute.put('/:id', valAuth, fileAuth, PostController.updatePost);

postRoute.get('/:id', PostController.findPost);

postRoute.get('', PostController.getAllPosts);

postRoute.use('/paginator', pageRoute);

module.exports = postRoute;