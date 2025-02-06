const mongoose = require("mongoose");

const buzzSchema = mongoose.Schema({
    title: { type : String, required: true},
    content: { type: String, required: true},
    imagePath: String,
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true}
});

module.exports =  mongoose.model('Post', buzzSchema);