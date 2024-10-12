const Teacher = require('../models/teacherModel');
const Class = require('../models/classModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getClassesByTeacherId = catchAsync(async (req, res, next) => {
  const { teacherId } = req.params;

  // Tìm giáo viên theo teacherId và populate các lớp học
  const teacherData = await Teacher.findById(teacherId).populate('classes'); // Sử dụng populate để lấy thông tin lớp học

  if (!teacherData) {
    return next(new AppError('No teacher found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      classes: teacherData.classes, // Trả về danh sách lớp học
    },
  });
});
