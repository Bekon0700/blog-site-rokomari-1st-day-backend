const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');

const crypto = require('crypto');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const createToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
  };

  // if (process.env.NODE_ENV === 'production') cookieOptions[secure] = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const createNewUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  res.status(201).json({
    status: 'success',
    user: createNewUser
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check if email and password is exists
  if (!email || !password) {
    return next(new AppError('please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  
  // 2) check if user exists and password match
  if (!user || !(await user.checkPassword(password, user.password))) {
    console.log(user)
    return next(new AppError('Invalid email or password', 401));
  }

  // if everything ok, send the data
  createToken(user, 201, res);
});

exports.protected = catchAsync(async (req, res, next) => {
  // 1) get the token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Please login to see the content', 401));
  }

  // 2) verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) check if user still exist
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError('The token belong to the user does not exist', 400)
    );
  }

  req.user = freshUser;

  //console.log(req.user);
  //Grant access to the next middleware
  next();
});

exports.restrictedTo = (...roles) => {
  // roles is an array -> ['admin', 'lead-guide']
  return (req, res, next) => {
    // console.log(req.user.role, roles);
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have the permission to do this operation', 403)
      );
    }
    next();
  };
};