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
  .patch(authController.restrictTo('admin'), classController.updateClass);

router
  .route('/:id/schedule')
  .get(authController.restrictTo('admin'), classController.getClassScheduleById);

module.exports = router;
