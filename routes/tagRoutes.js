const express = require('express');
const { restrictedTo, protected } = require('../controller/authController');
const { createTag, allTags } = require('../controller/tagController');

const router = express.Router();

router.route('/')
    .get(allTags)
    .post(protected, restrictedTo('admin') ,createTag)

module.exports = router;
