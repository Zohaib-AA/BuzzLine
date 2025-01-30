const mongoose = require("mongoose");

const buzzSchema = mongoose.Schema({
    title: { type : String, required: true},
    content: { type: String, required: true},
    imagePath: String
});

module.exports =  mongoose.model('Post', buzzSchema);