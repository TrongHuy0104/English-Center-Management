const express = require('express');
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
const studentController = require('../controllers/studentController');
const router = express.Router();

router.use(authController.protect, authController.restrictTo('admin'));

router
  .route('/')
  .get(adminController.getAdmins)
  .post(adminController.createAdmin);

router
  .route('/:id')
  .get(adminController.getAdmin)
  .patch(adminController.updateAdmin)
  .delete(adminController.deleteAdmin);

router.route('/:id/disable').patch(adminController.disableAdmin);
router.route('/:id/enable').patch(adminController.enableAdmin);

module.exports = router;
