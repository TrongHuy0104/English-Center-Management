const Admin = require('../models/adminModel');
const Student = require('../models/studentModel');
const Teacher = require('../models/teacherModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400,
      ),
    );
  }
  // 2) Filtered out unwanted fields names that are not allowed
  const filteredBody = filterObj(req.body, 'email');

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getRoleUser = catchAsync(async (req, res, next) => {
  let user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  let roleData;
  if (user.role === 'admin') {
    roleData = await Admin.findById(user.role_id);
  } else if (user.role === 'student') {
    roleData = await Student.findById(user.role_id);
  } else if (user.role === 'teacher') {
    roleData = await Teacher.findById(user.role_id);
  }

  user = {
    user,
    roleDetails: roleData, // contains specific data for the role
  };

  res.status(200).json({
    status: 'success',
    data: {
      data: user,
    },
  });
});

exports.createNewUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  if (!newUser) return;
  if (req.body.role === 'student') {
    const newStudent = await Student.create({
      name: req.body.name,
      centers: req.body.center,
    });
    await User.findByIdAndUpdate(newUser._id, { role_id: newStudent._id });
  }
  if (req.body.role === 'admin') {
    const newAdmin = await Admin.create({
      name: req.body.name,
      centers: req.body.center,
    });
    await User.findByIdAndUpdate(newUser._id, { role_id: newAdmin._id });
  }
  if (req.body.role === 'teacher') {
    const newTeacher = await Teacher.create({
      name: req.body.name,
      centers: req.body.center,
    });
    await User.findByIdAndUpdate(newUser._id, { role_id: newTeacher._id });
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: newUser,
    },
  });
});

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);

// Do NOT update passwords with this!
exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);
