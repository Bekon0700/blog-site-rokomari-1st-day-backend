const express = require('express');
const { restrictedTo, protected } = require('../controller/authController');
const { allBlogs, createBlog } = require('../controller/blogController');

const router = express.Router();

router.route('/')
    .get(allBlogs)
    .post(protected, restrictedTo('user') , createBlog)

module.exports = router;
