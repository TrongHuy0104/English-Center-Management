const Teacher = require('../models/teacherModel');
const factory = require('./handlerFactory');

exports.getTeacherById = factory.getOne(Teacher);
