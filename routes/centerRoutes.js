// routes/CenterRoutes.js
const express = require('express');
const centerController = require('../controllers/centerController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(centerController.getAllCenters)
  .post(authController.restrictTo('admin'), centerController.createCenter);

router
  .route('/:id')
  .get(centerController.getCenter)
  .patch(centerController.updateCenter)
  .delete(centerController.deleteCenter);
module.exports = router;
