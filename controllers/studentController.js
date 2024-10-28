const Student = require('../models/studentModel');
const factory = require('./handlerFactory');

exports.getStudentsDetails = factory.getOne(Student);