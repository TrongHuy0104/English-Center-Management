const express = require('express');
const catchAsync = require('../utils/catchAsync');

const app = express();

const Attendance = require('../models/attendanceModel');

// exports.getTeacherAttendanceSummary = catchAsync(async (req, res) => {
//   // Lấy ngày hiện tại và tạo khoảng thời gian từ ngày 5 tháng này đến ngày 5 tháng sau
//   const now = new Date();
//   const { teacherId } = req.params; // Lấy teacherId từ req.params
//   const startDay = new Date(now.getFullYear(), now.getMonth(), 5); // Ngày 5 tháng này
//   const endDay = new Date(now.getFullYear(), now.getMonth() + 1, 5); // Ngày 5 tháng sau

//   // Tính toán số lượng present cho giáo viên cụ thể trong khoảng thời gian 30 ngày
//   const result = await Attendance.aggregate([
//     {
//       $match: {
//         date: { $gte: startDay, $lte: endDay }, // Lọc trong khoảng từ startDay đến endDay
//         'teacher_attendance.status': 'present', // Lọc theo trạng thái present
//         'teacher_attendance.teacher_id': teacherId, // Lọc theo teacherId
//       },
//     },
//     {
//       $group: {
//         _id: '$teacher_attendance.teacher_id', // Group theo teacher_id
//         amount: { $sum: 1 }, // Đếm số lượng present
//       },
//     },
//     {
//       $project: {
//         _id: 0,
//         teacher_id: '$_id', // Trả về teacher_id
//         amount: 1, // Trả về số lượng present
//         startDay: { $literal: startDay.toISOString() }, // Trả về startDay
//         endDay: { $literal: endDay.toISOString() }, // Trả về endDay
//       },
//     },
//   ]);

//   // Kiểm tra nếu không có dữ liệu cho giáo viên đó
//   if (result.length === 0) {
//     return res.status(404).json({
//       message: `No attendance data found for teacher with ID ${teacherId}`,
//     });
//   }

//   // Trả về kết quả
//   res.json(result[0]); // Chỉ trả về dữ liệu cho giáo viên được yêu cầu
// });

// exports.getTeacherAttendanceSummary = async (req, res) => {
//   try {
//     const { teacherId } = req.params;
//     const startDate = new Date('2024-10-05');
//     const endDate = new Date('2024-11-05');

//     // Tìm số lượng ca làm việc của giáo viên dựa trên `teacherId`
//     const attendance = await Attendance.find({
//       'teacher_attendance.teacher_id': teacherId,
//       date: { $gte: startDate, $lte: endDate },
//       'teacher_attendance.status': 'present',
//     });

//     const amount = attendance.length;

//     res.status(200).json({
//       amount,
//       teacher_id: teacherId,
//       startDay: startDate,
//       endDay: endDate,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: 'error',
//       message: error.message,
//     });
//   }
// };

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
