const router = require('express').Router();
const authController = require('../controllers/authController');
const classController = require('../controllers/classController');
router.use(authController.protect);

router
  .route('/')
  .get(authController.restrictTo('admin'), classController.getAll)
  .post(authController.restrictTo('admin'), classController.createClass);
router
  .route('/:id')
  .get(authController.restrictTo('student'), classController.getClassById)
  .patch(authController.restrictTo('admin'), classController.updateClass);

router
  .route('/:id/schedule')
  .get(authController.restrictTo('admin'), classController.getClassScheduleById)
  .post(authController.restrictTo('admin'), classController.createClassSchedule)
  .patch(
    authController.restrictTo('admin'),
    classController.deleteClassSchedule,
  );

module.exports = router;
