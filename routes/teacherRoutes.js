// routes/feeRoutes.js
const express = require('express');
const teacherController = require('../controllers/teacherController');
const authController = require('../controllers/authController');
const classController = require('../controllers/classController');
const salaryController = require('../controllers/salaryController');
const attendanceController = require('../controllers/attendanceController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(teacherController.getAllTeachers)
  .post(authController.restrictTo('admin'), teacherController.createTeacher);

router.route('/all').get(teacherController.getAll);

router
  .route('/:id')
  .get(teacherController.getTeacher)
  .patch(teacherController.updateTeacher)
  .delete(teacherController.deleteTeacher);

router.get('/:teacherId/schedule', classController.getClassesByTeacherId);
router.get('/:teacherId/classes', classController.getClassesByTeacherId);
router.put('/:id', teacherController.updateTeacher);
router.get('/:teacherId/salary', salaryController.getSalaryByTeacherId);
//const upload = multer({ dest: 'uploads/' });
router.put('/upload/:id', teacherController.uploadAvatar);
// Nested attendance routes under teacher with slot support
router.patch(
  '/:teacherId/attendance/:slot',
  attendanceController.takeAttendance,
);
router.get(
  '/:teacherId/attendance/:slot',
  attendanceController.getAttendanceData,
);

router.route('/:id/disable').patch(teacherController.disableTeacher);
router.route('/:id/enable').patch(teacherController.enableTeacher);
module.exports = router;
