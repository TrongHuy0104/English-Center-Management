const router = require('express').Router();
const authController = require('../controllers/authController');
const studentController = require('../controllers/studentController');

// Bảo vệ tất cả các route bên dưới bằng cách sử dụng JWT
router.use(authController.protect);

// Cho phép student truy cập các route /fees
router.route('/fees')
  .get(studentController.getAllFeeOfStudent);
  router.route('/my-class')
  .get(studentController.getScheduleOfStudent);
router.route('/fees/:id')
  .get(studentController.getFee);  // Cho phép student và admin

module.exports = router;
