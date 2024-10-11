// routes/feeRoutes.js
const express = require('express');
const feeController = require('../controllers/feeController');
const authController = require('../controllers/authController');

const router = express.Router();

// Tất cả các route bên dưới yêu cầu người dùng phải đăng nhập
router.use(authController.protect);

// Các route quản lý Fee
router
  .route('/')
  .get(feeController.getAllFees) // Lấy tất cả học phí
  .post(authController.restrictTo('admin'), feeController.createFee); // Chỉ admin mới có thể tạo mới

router
  .route('/:id')
  .get(feeController.getFee) // Lấy thông tin của một fee theo ID
  .patch(feeController.updateFee) // Cập nhật thông tin của một fee theo ID
  .delete(feeController.deleteFee);
module.exports = router;
