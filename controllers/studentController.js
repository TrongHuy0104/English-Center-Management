const Student = require('../models/studentModel');
const factory = require('./handlerFactory');

// use funtcion from handlerFactory
exports.getStudent = factory.getAll(Student);
exports.getStudent = factory.getOne(Student);
exports.createStudent = factory.createOne(Student);
exports.updateStudent = factory.updateOne(Student);
exports.deleteStudent = factory.deleteOne(Student);
