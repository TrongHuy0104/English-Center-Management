const Student = require('../models/studentModel');
const Attendance = require('../models/attendanceModel');

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
    // .populate('class', 'className')
    // .populate('teacher', 'name');

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
