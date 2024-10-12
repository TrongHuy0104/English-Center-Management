const router = require('express').Router();
const teacherController = require('../controllers/teacherController');



// Route để giáo viên lấy lịch học theo teacherId
router.get('/:teacherId/schedule', teacherController.getTeacherSchedule);
// Route để giáo viên lấy class theo teacherId
router.get('/:teacherId/classes', teacherController.getClassesByTeacherId);
// Route để giáo viên cập nhật thông tin
router.put('/:id', teacherController.updateTeacher);
//Route để giáo viên lấy thông tin theo teacherId
router.get('/:id', teacherController.getTeacherById);
module.exports = router;
