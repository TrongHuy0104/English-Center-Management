// routes/SalaryRoutes.js
const express = require('express');
const salaryController = require('../controllers/salaryController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(salaryController.getAllSalaries)
  .post(authController.restrictTo('admin'), salaryController.createSalary);

router
  .route('/:id')
  .get(salaryController.getSalary)
  .patch(salaryController.updateSalary)
  .delete(salaryController.deleteSalary);
module.exports = router;
