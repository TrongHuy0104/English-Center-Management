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

exports.takeAttendance = catchAsync(async (req, res, next) => {
  const { attendanceList } = req.body;
  const teacherId = req.params.teacherId;
  const date = req.params.date;
  const slot = parseInt(req.params.slot, 10);

  if (
    !attendanceList ||
    !Array.isArray(attendanceList) ||
    attendanceList.length === 0 ||
    isNaN(slot)
  ) {
    return next(
      new AppError('Missing required fields: attendanceList, slot', 400),
    );
  }

  const formattedDate = new Date(date);

  if (!slotTimeMapping[slot]) {
    return next(new AppError('Invalid slot provided', 400));
  }

  const start_time = slotTimeMapping[slot].start;
  const end_time = slotTimeMapping[slot].end;

  let attendance = await Attendance.findOne({
    'teacher_attendance.teacher_id': teacherId,
    date: formattedDate,
    slot: slot,
  });

  if (attendance) {
    attendance.teacher_attendance.status = 'present';

    attendance.student_attendance = attendanceList.map((student) => ({
      student_id: student.studentId,
      status: student.status,
    }));
  } else {
    attendance = await Attendance.create({
      class: teacherId,
      date: formattedDate,
      teacher_attendance: {
        teacher_id: teacherId,
        status: 'present',
      },
      slot,
      start_time,
      end_time,
      student_attendance: attendanceList.map((student) => ({
        student_id: student.studentId,
        status: student.status,
      })),
    });
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
  const date = req.params.date;
  const slot = parseInt(req.params.slot, 10);

  if (!teacherId || !date || isNaN(slot)) {
    return next(
      new AppError('Teacher ID, date, and slot must be provided', 400),
    );
  }

  const formattedDate = new Date(date);

  const attendanceData = await Attendance.findOne({
    'teacher_attendance.teacher_id': teacherId,
    date: formattedDate,
    slot: slot,
  });

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
      attendance: attendanceData,
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
