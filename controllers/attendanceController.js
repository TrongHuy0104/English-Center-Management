const Attendance = require('../models/attendanceModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Student = require('../models/studentModel');

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
  const teacherId = req.params.teacherId;
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

  // Tìm bản ghi điểm danh cho giáo viên và ngày cụ thể
  let attendance = await Attendance.findOne({
    'teacher_attendance.teacher_id': teacherId,
    date: formattedDate,
    slot: slot // Thêm điều kiện slot vào tìm kiếm
  });

  // Tìm danh sách học sinh dựa trên attendanceList
  const studentIds = attendanceList.map(student => student.studentId);
  const students = await Student.find({ _id: { $in: studentIds } });

  // Tạo map tên học sinh
  const studentMap = students.reduce((map, student) => {
    map[student._id.toString()] = student.name; // Lưu tên học sinh theo ID
    return map;
  }, {});

  // Nếu bản ghi điểm danh đã tồn tại
  if (attendance) {
    // Cập nhật trạng thái của giáo viên nếu cần
    if (attendance.teacher_attendance.status === 'absent') {
      attendance.teacher_attendance.status = 'present';
    }

    // Cập nhật danh sách điểm danh của sinh viên
    const updatedStudentAttendance = attendanceList.map(student => ({
      student_id: student.studentId,
      status: student.status,
      name: studentMap[student.studentId] || 'Unknown' // Lưu tên học sinh
    }));

    // Merge với student_attendance đã có để không bị mất dữ liệu
    attendance.student_attendance = [
      ...attendance.student_attendance,
      ...updatedStudentAttendance,
    ];
  } else {
    // Nếu không tồn tại, tạo mới bản ghi điểm danh
    attendance = await Attendance.create({
      class: teacherId,
      date: formattedDate,
      teacher_attendance: {
        teacher_id: teacherId,
        status: 'present',
      },
      slot,
      start_time: slotTimeMapping[slot].start,
      end_time: slotTimeMapping[slot].end,
      student_attendance: attendanceList.map(student => ({
        student_id: student.studentId,
        status: student.status,
        name: studentMap[student.studentId] || 'Unknown' // Lưu tên học sinh
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
  const teacherId = req.params.teacherId;
  const date = req.params.date;
  const slot = parseInt(req.params.slot, 10);

  // Kiểm tra xem teacherId, date, và slot có được cung cấp không
  if (!teacherId || !date || isNaN(slot)) {
    return next(new AppError('Teacher ID, date, and slot must be provided', 400));
  }

  // Định dạng lại date
  const formattedDate = new Date(date);

  const attendanceData = await Attendance.findOne({
    'teacher_attendance.teacher_id': teacherId,
    date: formattedDate,
    slot: slot
  });

  if (!attendanceData) {
    return next(new AppError('No attendance data found for this teacher on this date', 404));
  }

  // Fetch student names based on their IDs
  const studentIds = attendanceData.student_attendance.map(s => s.student_id);
  const students = await Student.find({ _id: { $in: studentIds } });

  // Tạo map tên sinh viên
  const studentMap = students.reduce((map, student) => {
    map[student._id.toString()] = student.name; // Lưu tên sinh viên theo ID
    return map;
  }, {});

  // Map student names to attendance data
  const attendanceWithNames = attendanceData.student_attendance.map(studentAttendance => ({
    student_id: studentAttendance.student_id,
    status: studentAttendance.status,
    name: studentMap[studentAttendance.student_id] || 'Unknown' // Fallback for missing student
  }));

  // Trả về dữ liệu điểm danh
  res.status(200).json({
    status: 'success',
    data: {
      attendance: {
        ...attendanceData.toObject(),
        student_attendance: attendanceWithNames // Replace student_attendance with names
      },
    },
  });
});