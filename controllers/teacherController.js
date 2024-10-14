const Teacher = require('../models/teacherModel');
const Class = require('../models/classModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// Hàm lấy thông tin của giáo viên dựa trên teacherId
exports.getTeacherById = catchAsync(async (req, res, next) => {
    const teacherData = await Teacher.findById(req.params.id);
    console.log(req.params.id);
    if(!teacherData) {
        return next(new AppError('No teacher found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
          teacher 
        },
      });
});
// Hàm lấy lịch học của giáo viên dựa trên teacherId
exports.getTeacherSchedule = catchAsync(async (req, res, next) => {
    const teacherId = req.params.teacherId;
    const classes = await Class.find({ teacher: teacherId });

    if (!classes || classes.length === 0) {
        return next(new AppError('No schedule found for this teacher ID', 404));
    }

    const schedules = classes.map(classData => ({
        className: classData.name,
        schedule: classData.schedule
    }));

    res.status(200).json({
        status: 'success',
        data: {
            schedules
        }
    });
});

// Hàm lấy class của giáo viên dựa trên teacherId
exports.getClassesByTeacherId = catchAsync(async (req, res, next) => {
    const teacherId = req.params.teacherId; 
  
    const classes = await Class.find({ teacher: teacherId }); 
  
    if (classes.length === 0) {
      return next(new AppError('No classes found for this teacher ID', 404)); 
    }
  
    res.status(200).json({
      status: 'success',
      data: {
        classes, 
      },
    });
  });
  
  // Hàm cập nhật thông tin giáo viên
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
      }
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


  exports.getTeacherById = factory.getOne(Teacher);