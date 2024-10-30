const Fee = require('../models/feeModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getAllFees = factory.getAll(Fee);
exports.createFee = factory.createOne(Fee);
exports.updateFee = factory.updateOne(Fee);
exports.deleteFee = factory.deleteOne(Fee);

// Get all fees of a student
exports.getAllFeeOfStudent = catchAsync(async (req, res, next) => {
  const fees = await Fee.find({ 'students._id': req.user.role_id }).populate(
    'classDetails',
  );
  if (!fees || fees.length === 0)
    return next(new AppError('No fees found with that student ID', 404));
  res.status(200).json({
    status: 'success',
    results: fees.length,
    data: {
      fees,
    },
  });
});

// Get a specific fee
exports.getFee = catchAsync(async (req, res, next) => {
  const fee = await Fee.findById(req.params.id).populate('classDetails');

  if (!fee) return next(new AppError('No fee found with that ID', 404));
  res.status(200).json({
    status: 'success',
    data: {
      fee,
    },
  });
});
