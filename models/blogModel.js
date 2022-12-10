const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
    },
    subTitle: {
        type: String,
        trim: true,
    },
    authorName: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    tags: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Tags',
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now()
    },
})

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;