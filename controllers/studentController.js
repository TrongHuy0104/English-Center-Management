const Student = require('../models/studentModel');
const Attendance = require('../models/attendanceModel');
const Center = require('../models/centerModel');
const Class = require('../models/classModel');

exports.getStudentDetails = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('centers')
      .populate('classes');

    if (!student) {
      return res.status(404).json({
        status: 'fail',
        message: 'Student not found',
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

exports.getCenterById = async (req, res) => {
  try {
    const centers = await Center.findById(req.params.id);

    if (!centers) {
      return res.status(404).json({
        status: 'fail',
        message: 'Student not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        centers,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: 'Something went wrong',
    });
  }
};

exports.getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const attachment = await Attendance.findById(id);
    if (!attachment) {
      return res
        .status(4004)
        .json({ status: 'fail', message: 'Attendance not found' });
    }
    res.status(200).json({ status: 'success', data: attachment });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
      error: err.message,
    });
  }
};

exports.getClassById = async (req, res) => {
  try {
    const classes = await Class.findById(req.params.id);

    if (!classes) {
      return res.status(404).json({
        status: 'fail',
        message: 'Student not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        classes,
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
