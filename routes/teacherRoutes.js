// routes/feeRoutes.js
const express = require('express');
const teacherController = require('../controllers/teacherController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(teacherController.getAllTeachers)
  .post(authController.restrictTo('admin'), teacherController.createTeacher);
router.route('/all').get(teacherController.getAll);

router
  .route('/:id')
  .get(teacherController.getTeacher)
  .patch(teacherController.updateTeacher)
  .delete(teacherController.deleteTeacher);

router.route('/:id/disable').patch(teacherController.disableTeacher);
router.route('/:id/enable').patch(teacherController.enableTeacher);
module.exports = router;
