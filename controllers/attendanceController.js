const Attendance = require('../models/attendanceModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const slotTimeMapping = {
  1: { start: '09:00', end: '10:00' },
  2: { start: '10:15', end: '11:15' },
  3: { start: '11:30', end: '12:30' },
  4: { start: '12:30', end: '14:00' },
  5: { start: '14:15', end: '15:45' },
  6: { start: '16:00', end: '17:30' },
  7: { start: '18:00', end: '19:30' },
  8: { start: '19:45', end: '21:15' },
};

function timeStringToDate(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0); // Set hours and minutes
  return date;
}

function getCurrentSlot() {
  const now = new Date();
  const currentTime = new Date(
    timeStringToDate(now.toTimeString().slice(0, 5)).getTime(),
  );

  for (const [slot, times] of Object.entries(slotTimeMapping)) {
    const startTime = new Date(timeStringToDate(times.start)).getTime();
    const endTime = new Date(timeStringToDate(times.end)).getTime();

    if (currentTime >= startTime && currentTime <= endTime) {
      return slot;
    }
  }

  return null;
}

exports.takeAttendance = catchAsync(async (req, res, next) => {
  const { attendanceList } = req.body;
  const teacherId = req.params.teacherId;
  const slot = req.params.slot;
  const today = new Date();
  const currentDate = today.toISOString().split('T')[0];

  let attendance = await Attendance.findOne({
    'teacher_attendance.teacher_id': teacherId,
    date: new Date(currentDate).toISOString(),
    slot,
  });

  if (!attendance) throw new Error('No Attendance found');

  if (attendance) {
    attendance.teacher_attendance.status = 'present';

    attendance.student_attendance = attendance.student_attendance.map(
      (student, index) => ({
        student_id: student.student_id,
        status: attendanceList[index],
      }),
    );
  }

  await attendance.save();

  res.status(201).json({
    status: 'success',
    data: {
      attendance,
    },
  });
});

exports.getAttendanceData = catchAsync(async (req, res, next) => {
  const teacherId = req.params.teacherId;
  const slot = req.params.slot;
  const today = new Date();
  const currentDate = today.toISOString().split('T')[0];

  const attendanceData = await Attendance.findOne({
    'teacher_attendance.teacher_id': teacherId,
    date: new Date(currentDate).toISOString(),
    slot,
  }).populate('student_attendance.student_id');

  if (!attendanceData) {
    return next(
      new AppError(
        'No attendance data found for this teacher on this date',
        404,
      ),
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: attendanceData,
    },
  });
});

exports.getTeacherAttendanceSummary = async (req, res) => {
  try {
    const { teacherId } = req.params; // Lấy teacherId từ params
    const { startDay, endDay } = req.query; // Lấy startDay và endDay từ query params

    // Nếu startDay và endDay không được cung cấp, sử dụng giá trị mặc định từ ngày 1 tháng này tới ngày 1 tháng sau
    const now = new Date();
    const defaultStartDay = new Date(now.getFullYear(), now.getMonth(), 1); // Ngày 1 tháng này
    const defaultEndDay = new Date(now.getFullYear(), now.getMonth() + 1, 1); // Ngày 1 tháng sau

    const startDate = startDay ? new Date(startDay) : defaultStartDay; // Sử dụng startDay từ query hoặc mặc định
    const endDate = endDay ? new Date(endDay) : defaultEndDay; // Sử dụng endDay từ query hoặc mặc định

    // Tìm số lượng ca làm việc của giáo viên dựa trên `teacherId` và khoảng ngày
    const attendance = await Attendance.find({
      'teacher_attendance.teacher_id': teacherId,
      date: { $gte: startDate, $lte: endDate },
      'teacher_attendance.status': 'present',
    });

    const amount = attendance.length;

    res.status(200).json({
      amount,
      teacher_id: teacherId,
      startDay: startDate.toISOString(),
      endDay: endDate.toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.getAttendanceByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const attendanceRecords = await Attendance.find({
      'student_attendance.student_id': studentId,
    });
    if (attendanceRecords.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: `No attendance records found for student with ID ${studentId}`,
      });
    }
    res.status(200).json({
      status: 'success',
      data: attendanceRecords,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};
