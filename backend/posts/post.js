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



postRoute.post('', valAuth, multer({storage: storage}).single('image'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const buzz = new Buzz({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename 
    });
    buzz.save().then((createdBuzz) => {
        res.status(200).json({
            message: "Post added succesfully",
            buzz : {
                ...createdBuzz,
                id: createdBuzz._id
            }
        })
    });
})


postRoute.delete('/:id', valAuth, (req, res, next) => {
    console.log(req.params.id);
    Buzz.deleteOne({ _id: req.params.id }).then(result => {
        return Buzz.estimatedDocumentCount()
    }).then((maxCount)=>{
        res.status(200).json({
            message: "Deleted record",
            maxCount: maxCount
        })
        
    })
});

postRoute.put('/:id', valAuth, multer({storage: storage}).single('image'), (req, res, next) => {
    console.log(req.file);
    const file = req.file;
    let imagePath = req.body.imagePath;
    if(file){
        const url = req.protocol + '://' + req.get('host');
        imagePath =  url + "/images/" + req.file.filename; 
    }
    const buzz = new Buzz({ _id: req.body.id, title: req.body.title, content: req.body.content, imagePath: imagePath });
    console.log(buzz);
    Buzz.updateOne({ _id: req.params.id }, buzz).then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Updated succesfully',
        })
    })
})

postRoute.get('/:id', (req, res, next) => {
    console.log("wrong Request")
    Buzz.findById(req.params.id).then(buzz => {
        if (buzz) {
            res.status(200).json(buzz)
        } else {
            res.status(404).json({
                message: "Buzz not found!"
            })
        }
    })
});
postRoute.get('', (req, res, next) => {
    console.log('Request Received');
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
    })
});
postRoute.use('/paginator', pageRoute);


module.exports = postRoute;