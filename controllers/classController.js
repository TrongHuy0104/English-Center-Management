// controllers/feeController.js
const Class = require('../models/classModel');
const factory = require('./handlerFactory');

// use funtcion from handlerFactory
exports.getAllClasses = factory.getAll(Class);
exports.getClass = factory.getOne(Class);
exports.createClass = factory.createOne(Class);
exports.updateClass = factory.updateOne(Class);
exports.deleteClass = factory.deleteOne(Class);
