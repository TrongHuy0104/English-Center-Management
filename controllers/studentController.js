const Student = require('../models/studentModel');
const Attendance = require('../models/attendanceModel');
const Fee = require('../models/feeModel');
const Class = require('../models/classModel');  
const factory = require('./handlerFactory');
// Get a student by ID
exports.getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    console.log(student);
    if (!student) {
      return res.status(404).json({
        status: 'fail',
        message: 'No student found with that ID',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        student,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
      error: err.message,
    });
  }
};

// Update a student by ID
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return res.status(404).json({
        status: 'fail',
        message: 'No student found with that ID to Update!',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        student,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getStudentAttendanceReport = async (req, res) => {
  const studentId = req.user._id;
  try {
    const attendances = await Attendance.find({
      'student_attendance.student_id': studentId,
    });
    if (!attendances || attendances.length === 0) {
      return res
        .status(404)
        .json({ message: 'No attendance records found for this student.' });
    }

    const attendanceReport = attendances.map((attendance) => {
      const studentRecord = attendance.student_attendance.find(
        (record) => record.student_id.toString() === studentId,
      );
      return {
        _id: attendance._id,
        class: attendance.class.className,
        date: attendance.date,
        teacher: attendance.teacher_attendance.teacher_id.name,
        student_status: studentRecord ? studentRecord.status : 'N/A',
      };
    });

    res.json(attendanceReport);
  } catch (error) {
    console.error('Error fetching attendance report:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllFeeOfStudent = async (req, res, next) => {
  try {
    // Lấy dữ liệu fees và populate thông tin student và class
    const fees = await Fee.find({student: req.user._id})
      .populate('class', 'name');  // Lấy tên của class
      
    res.status(200).json({
      status: 'success',
      results: fees.length,
      data: {
        fees,
      },
    });
  } catch (err) {
    console.error('Error fetching fees:', err);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching fees',
    });
  }
};

exports.getScheduleOfStudent = async (req, res, next) => {
  try {
    // Tìm tất cả các lớp mà sinh viên hiện tại đang tham gia
    const classes = await Class.find({
      students: { $in: [req.user._id] }  // Tìm trong mảng students
    }).populate('schedule');

    res.status(200).json({
      status: 'success',
      results: classes.length,
      data: {
        classes,
      },
    });
  } catch (err) {
    console.error('Error fetching classes:', err);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching classes',
    });
  }
};

exports.getFeeClass = factory.getOne(Class);
exports.getFee = factory.getOne(Fee);