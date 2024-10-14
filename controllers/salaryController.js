// controllers/feeController.js
const Salary = require('../models/salaryModel');
const factory = require('./handlerFactory');

// use funtcion from handlerFactory
exports.getAllSalaries = factory.getAll(Fee);
exports.getSalary = factory.getOne(Fee);
exports.createSalary = factory.createOne(Fee);
exports.updateSalary = factory.updateOne(Fee);
exports.deleteSalary = factory.deleteOne(Fee);
