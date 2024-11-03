const AppError = require('../utils/appError');
const Class = require('../models/classModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const attendanceController = require('./attendanceController');
const Attendance = require('../models/attendanceModel');

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
    const isEnrolled = classData.students.some(
      (student) =>
        student._id.equals(req.user.role_id) &&
        student.enrollStatus === 'Enrolled', // Kiểm tra nếu `student.id` trùng với `role_id` của user hiện tại
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
    .populate('students._id', 'name phone');

  if (!classData) {
    return next(new AppError('Class not found', 404));
  }

  // Kiểm tra xem user hiện tại có enroll vào lớp này không
  const isEnrolled = classData.students.some(
    (student) =>
      student._id &&
      student._id.equals(req.user.role_id) &&
      student.enrollStatus === 'Enrolled',
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

exports.getClassScheduleById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const classData = await Class.findById(id)
    .populate('teacher', 'name')
    .populate('students._id', 'name phone');

  if (!classData) {
    return next(new AppError('Class not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      class: classData,
    },
  });
});

// Updated createClassSchedule API to include initial attendance creation
exports.createClassSchedule = catchAsync(async (req, res, next) => {
  const { id: classId } = req.params;
  const { schedules } = req.body;

  if (!Array.isArray(schedules) || schedules.length === 0) {
    return res.status(400).json({ message: 'Invalid schedules array' });
  }

  // Check if the class exists
  const classToUpdate = await Class.findById(classId).populate('teacher');
  if (!classToUpdate) {
    return res.status(404).json({ message: 'Class not found' });
  }

  const teacher = classToUpdate.teacher;
  if (!teacher) {
    return res
      .status(400)
      .json({ message: 'Teacher not assigned to the class' });
  }

  console.log('classToUpdate:', classToUpdate);
  console.log('teacherId:', teacher._id);

  // Add new schedules to the class
  schedules.forEach((schedule) => {
    if (
      !classToUpdate.schedule.find((item) => {
        return (
          item.date.toISOString().split('T')[0] ===
            new Date(schedule.date).toISOString().split('T')[0] &&
          +item.slot === +schedule.slot
        );
      })
    ) {
      classToUpdate.schedule.push(schedule);
    }
  });

  // Save the updated class
  await classToUpdate.save();

  // Create initial attendance
  const attendancePromises = schedules.map(async (schedule) => {
    console.log('Processing schedule:', schedule);

    const existingAttendance = await Attendance.findOne({
      class: classId,
      date: schedule.date,
      slot: schedule.slot,
    });

    if (!existingAttendance) {
      const newAttendance = new Attendance({
        class: classId,
        date: schedule.date,
        slot: schedule.slot,
        teacher_attendance: {
          teacher_id: teacher._id, // Ensure this is passed as an ObjectId
          status: 'absent', // or 'scheduled' depending on initial status
        },
        student_attendance: classToUpdate.students.map((student) => ({
          student_id: student._id,
          status: 'absent', // or 'absent' by default
        })),
      });

      console.log('Saving new attendance:', newAttendance);
      await newAttendance.save();
    } else {
      console.log(
        'Attendance already exists for date:',
        schedule.date,
        'and slot:',
        schedule.slot,
      );
    }
  });

  await Promise.all(attendancePromises);

  res.status(200).json({
    message: 'Schedules and initial attendance added successfully',
    schedules: classToUpdate.schedule,
  });
});

exports.deleteClassSchedule = catchAsync(async (req, res, next) => {
  const { id: classId } = req.params;
  const { postSchedule } = req.body;

  const classToUpdate = await Class.findById(classId);

  if (!classToUpdate) {
    return res.status(404).json({ message: 'Class not found' });
  }

  const filterSchedule = classToUpdate.schedule.filter((schedule) => {
    return (
      (schedule.date.toISOString().split('T')[0] ===
        postSchedule.date.split('T')[0] &&
        +schedule.slot !== +postSchedule.slot) ||
      schedule.date.toISOString().split('T')[0] !==
        postSchedule.date.split('T')[0]
    );
  });

  classToUpdate.schedule = filterSchedule;

  // Save the updated class
  await classToUpdate.save();
  res.status(200).json({
    message: 'Schedules added successfully',
    schedules: classToUpdate.schedule,
  });
});

exports.getAllClasses = factory.getAll(Class);
exports.getAll = factory.getAll(Class, ['schedule', 'teacher', 'students._id']);
exports.createClass = factory.createOne(Class);
exports.updateClass = factory.updateOne(Class);
