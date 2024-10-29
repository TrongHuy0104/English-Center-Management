const Attendance = require('../models/attendanceModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Define default time for each slot
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

// 1. Record or update attendance by slot
exports.takeAttendance = catchAsync(async (req, res, next) => {
  const { attendanceList } = req.body;
  const teacherId = req.params.teacherId;
  const date = req.params.date;
  const slot = parseInt(req.params.slot, 10);

  // Check if all required fields are present in the request body
  if (
    !attendanceList ||
    !Array.isArray(attendanceList) ||
    attendanceList.length === 0 ||
    isNaN(slot)
  ) {
    return next(new AppError('Missing required fields: attendanceList, slot', 400));
  }

  // Format the date
  const formattedDate = new Date(date);

  // Check if the slot is valid
  if (!slotTimeMapping[slot]) {
    return next(new AppError('Invalid slot provided', 400));
  }

  // Get start_time and end_time from mapping
  const start_time = slotTimeMapping[slot].start;
  const end_time = slotTimeMapping[slot].end;

  // Find attendance record for the specific teacher and date
  let attendance = await Attendance.findOne({
    'teacher_attendance.teacher_id': teacherId,
    date: formattedDate,
    slot: slot // Ensure to check slot here
  });

  // If attendance record already exists
  if (attendance) {
    // Update teacher's status if needed
    attendance.teacher_attendance.status = 'present'; // Set teacher's status to present

    // Update student attendance list
    attendance.student_attendance = attendanceList.map((student) => ({
      student_id: student.studentId,
      status: student.status,
    }));
  } else {
    // If not exists, create a new attendance record
    attendance = await Attendance.create({
      class: teacherId, // If needed to save teacherId into class
      date: formattedDate,
      teacher_attendance: {
        teacher_id: teacherId,
        status: 'present', // Set teacher's status to present
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

  // Save the attendance record
  await attendance.save();

  res.status(201).json({
    status: 'success',
    data: {
      attendance,
    },
  });
});

// 2. Get attendance data by date and slot
exports.getAttendanceData = catchAsync(async (req, res, next) => {
  const teacherId = req.params.teacherId;
  const date = req.params.date;
  const slot = parseInt(req.params.slot, 10);

  // Check if teacherId, date, and slot are provided
  if (!teacherId || !date || isNaN(slot)) {
    return next(new AppError('Teacher ID, date, and slot must be provided', 400));
  }

  // Format the date
  const formattedDate = new Date(date);

  const attendanceData = await Attendance.findOne({
    'teacher_attendance.teacher_id': teacherId,
    date: formattedDate,
    slot: slot // Ensure to search for the correct slot
  });

  if (!attendanceData) {
    return next(new AppError('No attendance data found for this teacher on this date', 404));
  }

  // Return attendance data
  res.status(200).json({
    status: 'success',
    data: {
      attendance: attendanceData,
    },
  });
});