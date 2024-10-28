// routes/feeRoutes.js
const express = require('express');
const attendanceController = require('../controllers/attendanceController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get(
  '/attendance-summary/:teacherId',
  attendanceController.getTeacherAttendanceSummary,
);

module.exports = router;
