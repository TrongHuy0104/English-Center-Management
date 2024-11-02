const Student = require('../models/studentModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');

// use funtcion from handlerFactory
// exports.getStudent = factory.getAll(Student);
exports.getStudent = factory.getOne(Student);
exports.createStudent = factory.createOne(Student);
exports.updateStudent = factory.updateOne(Student);
exports.deleteStudent = factory.deleteOne(Student);

const paginate = (array, page_size, page_number) => {
  const start = (page_number - 1) * page_size;
  const end = start + page_size;
  return array.slice(start, end);
};

exports.getStudents = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, active = 'all' } = req.query;
  const allStudents = await Student.find().populate('user');

  let filterStudents;
  switch (active) {
    case 'true':
      filterStudents = allStudents.filter(
        (student) => student.user[0].active === true,
      );
      break;
    case 'false':
      filterStudents = allStudents.filter(
        (student) => student.user[0].active === false,
      );
      break;
    default:
      filterStudents = allStudents;
  }
  const students = paginate(filterStudents, +limit, +page);

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: filterStudents.length,
    data: {
      data: students,
    },
  });
});

exports.createStudent = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: 'student',
  });

  if (!newUser) return;
  const newStudent = await Student.create({
    name: req.body.name,
    phone: req.body.phone,
    gender: req.body.gender,
    dateOfBirth: req.body.dateOfBirth,
  });
  await User.findByIdAndUpdate(newUser._id, { role_id: newStudent._id });

  res.status(200).json({
    status: 'success',
    data: {
      data: newUser,
    },
  });
});

exports.updateStudent = catchAsync(async (req, res, next) => {
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
  await Student.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    phone: req.body.phone,
    gender: req.body.gender,
    dateOfBirth: req.body.dateOfBirth,
  });

  res.status(200).json({
    status: 'success',
    message: 'Update successful',
  });
});

exports.disableStudent = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.params.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.enableStudent = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.params.id, { active: true });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
