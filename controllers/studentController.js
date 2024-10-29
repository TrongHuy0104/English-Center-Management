const Student = require('../models/studentModel');
const factory = require('./handlerFactory');


exports.getStudentDetails = factory.getOne(Student);