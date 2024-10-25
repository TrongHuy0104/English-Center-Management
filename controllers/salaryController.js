// controllers/feeController.js
const Salary = require('../models/salaryModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

// use funtcion from handlerFactory
// exports.getAllSalaries = factory.getAll(Fee);
exports.getSalary = factory.getOne(Salary);
exports.createSalary = factory.createOne(Salary);
exports.updateSalary = factory.updateOne(Salary);
exports.deleteSalary = factory.deleteOne(Salary);
exports.getAllSalaries = catchAsync(async (req, res, next) => {
  const salaries = await Salary.find().populate('teacher', 'name');

  res.status(200).json({
    status: 'success',
    results: salaries.length,
    data: {
      salaries,
    },
  });
});
