const express = require('express');

const pageRoute = express.Router();

const Buzz = require("../models/postModel");


pageRoute.get('', (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.currentPage;
    const findQuery = Buzz.find();
    if (pageSize && currentPage) {
        findQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    let fetchedBuzz;

    findQuery.then((documents) => {
        fetchedBuzz = documents;
        return Buzz.count();
    }).then((maxCount) => {
        res.status(200).json({
            message: "Collection sent",
            posts: fetchedBuzz,
            maxCount: maxCount
        });
    })
});

module.exports = pageRoute;