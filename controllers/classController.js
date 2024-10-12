const Class = require('../models/classModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getStudentsByClassId = catchAsync(async (req, res, next) => {
  const { classId } = req.params;

  // Tìm lớp theo classId
  const classData = await Class.findById(classId).populate('students'); // Sử dụng populate để lấy thông tin học sinh

  if (!classData) {
    return next(new AppError('No class found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      students: classData.students, // Trả về danh sách học sinh
    },
  });
});
