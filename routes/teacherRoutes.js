const router = require('express').Router();
const teacherController = require('../controllers/teacherController');
const attendanceController = require('../controllers/attendanceController');
const authController = require('../controllers/authController');

// Apply authentication middleware for all teacher routes
router.use(authController.protect);

// Teacher routes
router.get('/:teacherId/schedule', teacherController.getClassesByTeacherId);
router.get('/:teacherId/classes', teacherController.getClassesByTeacherId);
router.put('/:id', teacherController.updateTeacher);
router.get('/:id', teacherController.getTeacherById);
router.get('/:teacherId/salary', teacherController.getSalaryByTeacherId);
router.get('/:teacherId/center', teacherController.getCenterByTeacherId);

// Nested attendance routes under teacher
router.post('/attendance/classes/:classId/:date', attendanceController.takeAttendance);
router.get('/attendance/classes/:classId/:date', attendanceController.getAttendanceData);

module.exports = router;
