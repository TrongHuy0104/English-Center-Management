// controllers/SalaryController.js
const Salary = require('../models/salaryModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const Class = require('../models/classModel');

// use funtcion from handlerFactory
// exports.getAllFees = factory.getAll(Fee);
exports.getSalary = factory.getOne(Salary);
exports.createSalary = factory.createOne(Salary);
exports.updateSalary = factory.updateOne(Salary);
exports.deleteSalary = factory.deleteOne(Salary);

exports.getAllSalarys = catchAsync(async (req, res, next) => {
  const Salaries = await Salary.find().populate('student', 'name phone');

  res.status(200).json({
    status: 'success',
    results: salaries.length,
    data: {
      salaries,
    },
  });
});
