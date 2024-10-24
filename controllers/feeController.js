const Fee = require('../models/feeModel');
const Class = require('../models/classModel'); 
const catchAsync = require('../utils/catchAsync'); 
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// Get all fees of a student
exports.getAllFeeOfStudent = catchAsync(async (req, res, next) => {
  const fees = await Fee.find({ "students._id": req.user.role_id }).populate('classDetails');
  if (!fees || fees.length === 0) {
    return next(new AppError('No fees found with that student ID', 404));
  }

  res.status(200).json({
    status: 'success',
    results: fees.length,
    data: {
      fees,
    },
  });
});


exports.getFeeClass = factory.getOne(Class);
exports.getFee = factory.getOne(Fee);