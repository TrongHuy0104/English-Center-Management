const router = require('express').Router();
const authController = require('../controllers/authController');
const studentController = require('../controllers/studentController');

// Bảo vệ tất cả các route bên dưới bằng cách sử dụng JWT
router.use(authController.protect);

// Route cho phép student truy cập vào fees
router.route('/fees')
  .get(studentController.getAllFeeOfStudent);

router.route('/fees/:id')
  .get(studentController.getFee);  // Cho phép student và admin truy cập vào một fee cụ thể

// Route để lấy lịch học của student
router.route('/my-class')
  .get(studentController.getScheduleOfStudent);

// Route để lấy báo cáo điểm danh của student
router.route('/attendance/:id')
  .get(studentController.getStudentAttendanceReport);

// Get a student by ID
router.route('/profile/:id')
  .get(studentController.getStudentProfile)
  .put(studentController.updateStudent);  // Gộp GET và PUT cho cùng một route

module.exports = router;
