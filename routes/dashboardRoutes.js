const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect, authController.restrictTo('admin'));

router.route('/').get(dashboardController.getDashboard);

module.exports = router;
