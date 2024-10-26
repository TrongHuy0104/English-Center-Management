const router = require('express').Router();
const teacherController = require('../controllers/teacherController');
const classController = require('../controllers/classController');
const salaryController = require('../controllers/salaryController');
const centerController = require('../controllers/centerController');
const attendanceController = require('../controllers/attendanceController');

router.get('/:teacherId/schedule', classController.getClassesByTeacherId);
router.get('/:teacherId/classes', classController.getClassesByTeacherId);
router.put('/:id', teacherController.updateTeacher);
router.get('/:id', teacherController.getTeacherById);
router.get('/:teacherId/salary', salaryController.getSalaryByTeacherId);
router.get('/:teacherId/centers', centerController.getAllCenterByTeacherId);
// Nested attendance routes under teacher with slot support
router.put('/:teacherId/attendance/:date/:slot', attendanceController.takeAttendance);
router.get('/:teacherId/attendance/:date/:slot', attendanceController.getAttendanceData);
module.exports = router;
