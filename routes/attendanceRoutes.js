const express = require('express');
const attendanceController = require('../controllers/attendanceController');
const authController = require('../controllers/authController');
const router = express.Router();

// Đảm bảo rằng middleware protect được sử dụng
router.use(authController.protect);

// Điểm danh học sinh - Cập nhật hoặc tạo mới
router.put('/classes/:classId/attendance/:date', attendanceController.takeOrUpdateAttendance);

// Lấy dữ liệu điểm danh
router.get('/classes/:classId/attendance/:date', attendanceController.getAttendanceData);

module.exports = router;
