const router = require('express').Router();
const studentController = require('../controllers/studentController');
const authController = require('../controllers/authController');
const feeController = require('../controllers/feeController');
const classController = require('../controllers/classController');
const notificationController = require('../controllers/notificationController');
// Bảo vệ tất cả các route bên dưới bằng cách sử dụng JWT
router.use(authController.protect);

router.get('/:id', studentController.getStudentsDetails);
// Route cho phép student truy cập vào fees
router.route('/fees').get(feeController.getAllFeeOfStudent);

router.route('/fees/:id').get(feeController.getFee); // Cho phép student và admin truy cập vào một fee cụ thể

// Route để lấy lịch học của student
router.route('/my-class').get(classController.getScheduleOfStudent);

router.route('/classes').get(classController.getAllClass);

router.get('/classes/:id', classController.getClassById);

router
  .route('/classes/enroll-request')
  .post(notificationController.sendEnrollRequest);

module.exports = router;
