// routes/ClasseRoutes.js
const express = require('express');
const classController = require('../controllers/classController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(classController.getAllClasses)
  .post(authController.restrictTo('admin'), classController.createClass);

router
  .route('/:id')
  .get(classController.getClass)
  .patch(classController.updateClass)
  .delete(classController.deleteClass);
module.exports = router;
