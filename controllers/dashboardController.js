const catchAsync = require('../utils/catchAsync');
const Admin = require('../models/adminModel');
const Student = require('../models/studentModel');
const Teacher = require('../models/teacherModel');
const Class = require('../models/classModel');

exports.getDashboard = catchAsync(async (req, res, next) => {
  const admins = await Admin.countDocuments({ active: { $ne: false } });
  const students = await Student.countDocuments({ active: { $ne: false } });
  const teachers = await Teacher.countDocuments({ active: { $ne: false } });
  const classes = await Class.countDocuments({ active: { $ne: false } });

  const classTypeSummaries = await Class.aggregate([
    {
      $group: {
        _id: '$type',
        value: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    admins,
    students,
    teachers,
    classes,
    types: classTypeSummaries,
  });
});
