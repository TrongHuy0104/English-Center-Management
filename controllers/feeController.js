// controllers/feeController.js
const Fee = require('../models/feeModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const Class = require('../models/classModel');

// use funtcion from handlerFactory
exports.getAllFees = factory.getAll(Fee);
// exports.getFee = factory.getOne(Fee);
exports.createFee = factory.createOne(Fee);
exports.updateFee = factory.updateOne(Fee);
exports.deleteFee = factory.deleteOne(Fee);

exports.getFee = catchAsync(async (req, res, next) => {
  const fee = await Fee.findById(req.params.id).populate('classDetails');

  if (!fee) {
    return next(new AppError('No fee found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      fee,
    },
  });
});
