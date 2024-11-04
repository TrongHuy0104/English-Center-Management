// routes/feeRoutes.js
const express = require('express');
const feeController = require('../controllers/feeController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(feeController.getAllFees)
  .post(authController.restrictTo('admin'), feeController.createFee);

router
  .route('/:id')
  .get(feeController.getFee)
  .patch(feeController.updateFee)
  .delete(feeController.deleteFee)
  .post(feeController.createClassInFee);

router.route('/:id/classes/:classId').delete(feeController.deleteClassInFee);
module.exports = router;
