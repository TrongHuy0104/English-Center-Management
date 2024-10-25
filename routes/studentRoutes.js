const router = require('express').Router();
const authController = require('../controllers/authController');
const feeController = require('../controllers/feeController');
const classController = require('../controllers/classController')
// Bảo vệ tất cả các route bên dưới bằng cách sử dụng JWT
router.use(authController.protect);

// Route cho phép student truy cập vào fees
router.route('/fees')
  .get(feeController.getAllFeeOfStudent);

router.route('/fees/:id')
  .get(feeController.getFee);  // Cho phép student và admin truy cập vào một fee cụ thể

// Route để lấy lịch học của student
router.route('/my-class')
  .get(classController.getScheduleOfStudent);

  router.route('/my-class/classes')
  .get(classController.getAllClass);

module.exports = router;
