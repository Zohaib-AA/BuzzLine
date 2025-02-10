const express = require('express');

const postRoute = express.Router();

const Buzz = require("../models/postModel");

const multer = require('multer');

const pageRoute = require('./paginator');

const valAuth = require('../middleware/validate-auth');

const MIME_TYPE = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE[file.mimetype];
        let error = new Error('Invalid Mime Type');
        if (isValid) {
            error = '';
        }
        cb(error, 'backend/images');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
})



postRoute.post('', valAuth, multer({ storage: storage }).single('image'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const buzz = new Buzz({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    });
    buzz.save().then((createdBuzz) => {
        res.status(200).json({
            message: "Post added succesfully",
            buzz: {
                ...createdBuzz,
                id: createdBuzz._id
            }
        })
    }).catch(error => {
        res.status(500).json({
            message: 'Post could not be added!',
            error: error
        })
    })
        ;
})


postRoute.delete('/:id', valAuth, (req, res, next) => {
    Buzz.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
        if (result.deletedCount <= 0) {
            res.status(401).json({
                message: 'You are not authorized!'
            })
        }
        return Buzz.estimatedDocumentCount()
    }).then((maxCount) => {
        res.status(200).json({
            message: "Record has been deleted",
            maxCount: maxCount
        })
    }).catch(error => {
        res.status(500).json({
            message: 'Deletion attempt failed!',
            error: error
        })
    })
});

postRoute.put('/:id', valAuth, multer({ storage: storage }).single('image'), (req, res, next) => {
    const file = req.file;
    let imagePath = req.body.imagePath;
    if (file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + "/images/" + req.file.filename;
    }
    const buzz = new Buzz({ _id: req.body.id, title: req.body.title, content: req.body.content, imagePath: imagePath, creator: req.userData.userId });
    Buzz.updateOne({ _id: req.params.id, creator: req.userData.userId }, buzz).then(result => {
        if (result.modifiedCount > 0) {
            res.status(200).json({
                message: 'Post updated succesfully',
            });
        } else {
            res.status(401).json({
                message: 'You are not authorized!'
            })
        }
    }).catch(error => {
        res.status(500).json({
            message: 'Update attempt failed!',
            error: error
        })
    })
})

postRoute.get('/:id', (req, res, next) => {
    Buzz.findById(req.params.id).then(buzz => {
        if (buzz) {
            res.status(200).json(buzz)
        } else {
            res.status(404).json({
                message: "No Buzz exists with this id!"
            })
        }
    }).catch(error => {
        res.status(500).json({
            message: 'Some error occured with the server!',
            error: error
        })
    })
});

postRoute.get('', (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.currentPage;
    const findQuery = Buzz.find();
    if (pageSize && currentPage) {
        findQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    let fetchedBuzz;

    findQuery.then(documents => {
        fetchedBuzz = documents;
        return Buzz.estimatedDocumentCount()
    }).then(maxCount => {
        res.status(200).json({
            message: "Collection sent",
            posts: fetchedBuzz,
            maxCount: maxCount
        });
    }).catch(error => {
        res.status(500).json({
            message: 'Fetching buzz failed!',
            error: error
        })
    })
});

postRoute.use('/paginator', pageRoute);
module.exports = postRoute;