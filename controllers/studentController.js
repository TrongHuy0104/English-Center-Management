const Student = require('../models/studentModel');
const factory = require('./handlerFactory');

exports.getStudentsDetails = factory.getOne(Student);
exports.getStudent = factory.getAll(Student);
exports.createStudent = factory.createOne(Student);
exports.updateStudent = factory.updateOne(Student);
exports.deleteStudent = factory.deleteOne(Student);
