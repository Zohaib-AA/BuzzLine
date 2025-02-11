const Buzz = require("../models/postModel");

exports.createPost = (req, res, next) => {
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
}

exports.deletePost = (req, res, next) => {
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
}

exports.updatePost = (req, res, next) => {
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
}

exports.findPost = (req, res, next) => {
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
}

exports.getAllPosts = (req, res, next) => {
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
}