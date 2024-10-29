const Class = require('../models/classModel');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');

exports.getScheduleOfStudent = catchAsync(async (req, res, next) => {
  // Tìm tất cả các lớp mà sinh viên hiện tại đang tham gia
  const classes = await Class.find({
    'students._id': req.user.role_id, // Tìm kiếm trong mảng các đối tượng students có `id` trùng với role_id của user
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

exports.getAllClass = catchAsync(async (req, res, next) => {
  // Lấy tất cả các lớp
  const classes = await Class.find().populate('schedule');

  if (!classes) {
    return next(new AppError('No classes found', 404));
  }

  // Thêm thuộc tính `isEnrolled` cho mỗi lớp để kiểm tra xem user đã tham gia chưa
  const classesWithEnrollmentStatus = classes.map((classData) => {
    const isEnrolled = classData.students.some(student => 
      student._id.equals(req.user.role_id) && student.enrollStatus === 'Enrolled' // Kiểm tra nếu `student.id` trùng với `role_id` của user hiện tại
    );
    return {
      ...classData.toObject(),
      isEnrolled, // Thêm thuộc tính isEnrolled vào đối tượng lớp
    };
  });

  res.status(200).json({
    status: 'success',
    results: classesWithEnrollmentStatus.length,
    data: {
      classes: classesWithEnrollmentStatus,
    },
  });
});

exports.getClassById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Tìm lớp học theo ID
  const classData = await Class.findById(id)
    .populate('teacher', 'name')
    .populate('students._id', 'name phone')

  if (!classData) {
    return next(new AppError('Class not found', 404));
  }

  // Kiểm tra xem user hiện tại có enroll vào lớp này không
  const isEnrolled = classData.students.some(student => 
    student._id && student._id.equals(req.user.role_id) && student.enrollStatus === 'Enrolled'
  );

  // Thêm thuộc tính `isEnrolled` vào đối tượng lớp
  const classWithEnrollmentStatus = {
    ...classData.toObject(),
    isEnrolled,
  };

  res.status(200).json({
    status: 'success',
    data: {
      class: classWithEnrollmentStatus,
    },
  });
});
