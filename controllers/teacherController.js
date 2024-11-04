const Teacher = require('../models/teacherModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');

const paginate = (array, page_size, page_number) => {
  const start = (page_number - 1) * page_size;
  const end = start + page_size;
  return array.slice(start, end);
};

exports.getAll = factory.getAll(Teacher);
exports.getTeacher = factory.getOne(Teacher);
exports.deleteTeacher = factory.deleteOne(Teacher);
// exports.createTeacher = factory.createOne(Teacher);
// exports.updateTeacher = factory.updateOne(Teacher);const Teacher = require('../models/teacherModel');

exports.getAllTeachers = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, active = 'all' } = req.query;
  const allTeachers = await Teacher.find()
    .populate('user')
    .populate('classes name');
  let filterTeachers;
  switch (active) {
    case 'true':
      filterTeachers = allTeachers.filter(
        (teacher) => teacher.user[0].active === true,
      );
      break;
    case 'false':
      filterTeachers = allTeachers.filter(
        (teacher) => teacher.user[0].active === false,
      );
      break;
    default:
      filterTeachers = allTeachers;
  }
  const teachers = paginate(filterTeachers, +limit, +page);
  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: filterTeachers.length,
    data: {
      data: teachers,
    },
  });
});

exports.createTeacher = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: 'teacher',
  });

  if (!newUser) return;
  const newTeacher = await Teacher.create({
    name: req.body.name,
    phone: req.body.phone,
    gender: req.body.gender,
    shiftPay: req.body.shiftPay,
    classes: req.body.classes,
  });
  await User.findByIdAndUpdate(newUser._id, { role_id: newTeacher._id });

  res.status(200).json({
    status: 'success',
    data: {
      data: newUser,
    },
  });
});

exports.disableTeacher = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.params.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.enableTeacher = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.params.id, { active: true });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateTeacher = catchAsync(async (req, res, next) => {
  const updateUser = await User.findByIdAndUpdate(
    req.body.userId,
    {
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updateUser) return;
  await Teacher.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    phone: req.body.phone,
    gender: req.body.gender,
    shiftPay: req.body.shiftPay,
    classes: req.body.classes,
  });

  res.status(200).json({
    status: 'success',
    message: 'Update successful',
  });
});

// Get teacher by ID
exports.getTeacherById = catchAsync(async (req, res, next) => {
  const teacherData = await Teacher.findById(req.params.id);
  if (!teacherData) {
    return next(new AppError('No teacher found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      teacher: teacherData,
    },
  });
});

// Update teacher
exports.updateTeacher = catchAsync(async (req, res, next) => {
  const teacherId = req.params.id;
  const updatedTeacher = await Teacher.findByIdAndUpdate(
    teacherId,
    {
      name: req.body.name,
      phone: req.body.phone,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedTeacher) {
    return next(new AppError('No teacher found with that ID', 404));
  }

  const { name, phone, gender, dateOfBirth } = updatedTeacher;

  res.status(200).json({
    status: 'success',
    data: {
      teacher: {
        name,
        phone,
        gender,
        dateOfBirth,
      },
    },
  });
});

exports.uploadAvatar = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const avatar = req.body.avatar;
  const teacher = await Teacher.findById(id);
  if (!teacher) {
    return next(new AppError('No teacher found with that ID', 404));
  }
  teacher.avatar = avatar;
  await teacher.save();
  res.status(200).json({
    status: 'success',
    message: 'Avatar uploaded successfully',
    data: {
      teacher,
    },
  });
});
