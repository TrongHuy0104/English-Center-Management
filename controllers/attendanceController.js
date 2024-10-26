const Attendance = require('../models/attendanceModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Định nghĩa thời gian mặc định cho từng slot
const slotTimeMapping = {
  1: { start: '09:00', end: '10:00' },
  2: { start: '10:15', end: '11:15' },
  3: { start: '11:30', end: '12:30' },
  4: { start: '12:30', end: '14:00' },
  5: { start: '14:15', end: '15:45' },
  6: { start: '16:00', end: '17:30' },
  7: { start: '18:00', end: '19:30' },
  8: { start: '19:45', end: '21:15' }
};

// 1. Ghi nhận hoặc cập nhật điểm danh theo slot
exports.takeAttendance = catchAsync(async (req, res, next) => {
  const { attendanceList } = req.body;
  const classId = req.params.classId;
  const date = req.params.date;
  const slot = parseInt(req.params.slot, 10);

  // Kiểm tra xem tất cả các trường cần thiết đã có trong body request chưa
  if (
    !attendanceList ||
    !Array.isArray(attendanceList) ||
    attendanceList.length === 0 ||
    isNaN(slot)
  ) {
    return next(new AppError('Missing required fields: attendanceList, slot', 400));
  }

  // Định dạng lại date
  const formattedDate = new Date(date);

  // Kiểm tra xem slot có hợp lệ không
  if (!slotTimeMapping[slot]) {
    return next(new AppError('Invalid slot provided', 400));
  }

  // Lấy start_time và end_time từ mapping
  const start_time = slotTimeMapping[slot].start;
  const end_time = slotTimeMapping[slot].end;

  // Tìm bản ghi điểm danh cho lớp và ngày cụ thể
  let attendance = await Attendance.findOne({
    class: classId,
    date: formattedDate,
  });

  const teacherId = req.user && req.user.id;

  // Nếu bản ghi điểm danh đã tồn tại
  if (attendance) {
    // Cập nhật trạng thái của giáo viên nếu cần
    if (attendance.teacher_attendance.status === 'absent') {
      attendance.teacher_attendance.status = 'present';
    }

    // Cập nhật danh sách điểm danh của sinh viên
    attendance.student_attendance = attendanceList.map((student) => ({
      student_id: student.studentId,
      status: student.status,
    }));
  } else {
    // Nếu không tồn tại, tạo mới bản ghi điểm danh
    attendance = await Attendance.create({
      class: classId,
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

  // Lưu bản ghi điểm danh
  await attendance.save();

  res.status(201).json({
    status: 'success',
    data: {
      attendance,
    },
  });
});

// 2. Lấy dữ liệu điểm danh theo ngày và slot
exports.getAttendanceData = catchAsync(async (req, res, next) => {
  const classId = req.params.classId;
  const date = req.params.date;
  const slot = parseInt(req.params.slot, 10);

  // Kiểm tra xem classId, date, và slot có được cung cấp không
  if (!classId || !date || isNaN(slot)) {
    return next(new AppError('Class ID, date, and slot must be provided', 400));
  }

  // Định dạng lại date
  const formattedDate = new Date(date);

  const attendanceData = await Attendance.findOne({
    class: classId,
    date: formattedDate,
  });

  if (!attendanceData) {
    return next(new AppError('No attendance data found for this class on this date', 404));
  }

  // Trả về dữ liệu điểm danh
  res.status(200).json({
    status: 'success',
    data: {
      attendance: attendanceData,
    },
  });
});
