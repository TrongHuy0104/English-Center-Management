const Attendance = require('../models/attendanceModel');

exports.getAttendanceByStudentId = async (req, res) => {
  const studentId = req.params.studentId;

  try {
    const attendanceRecords = await Attendance.find({
      'student_attendance.student_id': studentId,
    });

    if (attendanceRecords.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'No attendance records found for this student.',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        attendanceRecords,
      },
    });
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching attendance records.',
    });
  }
};
