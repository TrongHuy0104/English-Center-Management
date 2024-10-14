const router = require('express').Router();
const teacherController = require('../controllers/teacherController');

router.get('/:teacherId/schedule', teacherController.getTeacherSchedule);
router.get('/:teacherId/classes', teacherController.getClassesByTeacherId);
router.put('/:id', teacherController.updateTeacher);
router.get('/:id', teacherController.getTeacherById);

module.exports = router;
