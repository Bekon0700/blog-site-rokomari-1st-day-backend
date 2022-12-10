const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const Tags = require('./../models/tagModel')

exports.createTag = catchAsync(async (req, res, next) => {
    const tag =  req.body
    const newTag = await Tags.create(tag)
    res.status(201).json({
        status: 'success',
        tag: newTag
    })
  });


exports.allTags = catchAsync(async (req, res, next) => {
    const tags = await Tags.find()
    res.status(200).json({
        status: 'success',
        count: tags.length,
        tags
    })
  });