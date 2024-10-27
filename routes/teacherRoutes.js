const router = require('express').Router();
const teacherController = require('../controllers/teacherController');

//Route để giáo viên lấy thông tin theo teacherId
router.get('/:id', teacherController.getTeacherById);
module.exports = router;
