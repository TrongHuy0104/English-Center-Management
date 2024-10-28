const Notification = require('../models/notificationModel');
const Class = require('../models/classModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.sendEnrollRequest = catchAsync(async (req, res, next) => {
    const { classId } = req.body; // Lấy ID lớp từ request body
    const studentId = req.user.role_id; // Lấy ID của học sinh từ thông tin đăng nhập của user
  
    // Tìm lớp học để kiểm tra và lấy thông tin trung tâm, giáo viên
    const classData = await Class.findById(classId).populate('center');
    
    if (!classData) {
      return next(new AppError('Class not found', 404));
    }
  
    // Kiểm tra xem học sinh đã enroll vào lớp này chưa
    const isAlreadyEnrolled = classData.students.some(student =>
      student._id.equals(studentId) && student.enrollStatus === 'Enrolled'
    );
  
    if (isAlreadyEnrolled) {
      return next(new AppError('You are already enrolled in this class.', 400));
    }
  
    // Kiểm tra xem đã gửi yêu cầu đăng ký vào lớp này hay chưa
    const existingRequest = await Notification.findOne({
      notificationType: 'requestEnroll',
      student: studentId,
      class: classId,
    });
  
    if (existingRequest) {
      return next(new AppError('You have already sent an enroll request for this class.', 400));
    }
  
    // Lấy ID của trung tâm từ lớp học
    const centerId = classData.center._id;
  
    // Tạo thông báo đăng ký mới
    const notification = await Notification.create({
      notificationType: 'requestEnroll',
      student: studentId,
      class: classId,
      center: centerId,
      isSeen: false,
    });
  
    res.status(200).json({
      status: 'success',
      message: 'Enroll request has been sent to the admin!',
      data: {
        notification,
      },
    });
  });
  