const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    tag: {
        type: String,
        trim: true,
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
})

const Tags = mongoose.model('Tags', tagSchema);

module.exports = Tags;