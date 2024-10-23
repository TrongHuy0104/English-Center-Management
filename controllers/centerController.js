const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const Center = require('../models/centerModel');

// Get all centers by teacherId

exports.getAllCenterByTeacherId = factory.getAll(Center);
