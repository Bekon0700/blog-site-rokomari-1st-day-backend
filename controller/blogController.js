const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const Blog = require('./../models/blogModel')

exports.createBlog = catchAsync(async (req, res, next) => {
    const blog = {
        ...req.body,
        authorName: req.user.name
    }
    console.log(blog)
    const newBlog = await Blog.create(blog)
    res.status(201).json({
        status: 'success',
        blog: newBlog
    })
  });


exports.allBlogs = catchAsync(async (req, res, next) => {
    const blogs = await Blog.find().populate('tags')
    res.status(200).json({
        status: 'success',
        count: blogs.length,
        blogs
    })
  });