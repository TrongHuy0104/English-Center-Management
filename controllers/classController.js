const Class = require('../models/classModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllClass = factory.getAll(Class);

exports.getScheduleOfStudent = catchAsync(async (req, res, next) => {
  // Tìm tất cả các lớp mà sinh viên hiện tại đang tham gia
  const classes = await Class.find({
    students: { $in: [req.user.role_id] }, // Tìm trong mảng students
  }).populate('schedule');
  if (!classes) {
    return next(new AppError('No classes found with that Student ID', 404));
  }
  res.status(200).json({
    status: 'success',
    results: classes.length,
    data: {
      classes,
    },
  });
});
