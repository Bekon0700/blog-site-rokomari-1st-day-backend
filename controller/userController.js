const User = require('./../models/userModel');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const filterObj = (reqObj, ...allowedFields) => {
  const newObj = {};
  Object.keys(reqObj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = reqObj[el];
    }
  });
  return newObj;
};

exports.getAllUser = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) check if user sent password info
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password update, use /updateMyPassword route',
        400
      )
    );
  }

  // 2) remove unauthorized thing from update list
  //console.log(req.body);
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  // 3) sent user data
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  // 3) sent user data
  res.status(204).json({
    status: 'success',
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
});

exports.createNewUser = (req, res) => {
  res.status(500).json({
    message: 'file not found 4554',
  });
};

exports.getSpecificUser = (req, res) => {
  res.status(500).json({
    message: 'file not found',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    message: 'file not found',
  });
};

exports.deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  // 3) sent user data
  res.status(204).json({
    status: 'success',
  });
});
