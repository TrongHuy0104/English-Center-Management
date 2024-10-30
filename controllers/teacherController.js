const Teacher = require('../models/teacherModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// Get teacher by ID
exports.getTeacherById = catchAsync(async (req, res, next) => {
  const teacherData = await Teacher.findById(req.params.id);
  if (!teacherData) {
    return next(new AppError('No teacher found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: teacherData,
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
exports.getAllTeachers = factory.getAll(Teacher);
exports.getTeacher = factory.getOne(Teacher);
exports.createTeacher = factory.createOne(Teacher);
exports.deleteTeacher = factory.deleteOne(Teacher);
