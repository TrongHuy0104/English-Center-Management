const router = require('express').Router();
const classController = require('../controllers/classController');  

// Route để lấy lớp học theo classId
router.get('/:id', classController.getClassById);
router.route('/').get(classController.getAllClasses);


module.exports = router;
