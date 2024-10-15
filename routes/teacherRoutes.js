const router = require('express').Router();
const teacherController = require('../controllers/teacherController');

router.get('/:teacherId/schedule', teacherController.getClassesByTeacherId);
router.get('/:teacherId/classes', teacherController.getClassesByTeacherId);
router.put('/:id', teacherController.updateTeacher);
router.get('/:id', teacherController.getTeacherById);
router.get('/:teacherId/salary', teacherController.getSalaryByTeacherId);
router.get('/:teacherId/center', teacherController.getCenterByTeacherId);
module.exports = router;
