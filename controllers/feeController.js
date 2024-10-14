// controllers/feeController.js
const Fee = require('../models/feeModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// use funtcion from handlerFactory
// exports.getAllFees = factory.getAll(Fee);
exports.getFee = factory.getOne(Fee);
exports.createFee = factory.createOne(Fee);
exports.updateFee = factory.updateOne(Fee);
exports.deleteFee = factory.deleteOne(Fee);

exports.getAllFees = catchAsync(async (req, res, next) => {
  try {
    // get fee data and populate student and class from class
    const fees = await Fee.find().populate('student', 'name phone');

    res.status(200).json({
      status: 'success',
      results: fees.length,
      data: {
        fees,
      },
    });
  } catch (err) {
    console.error('Error fetching fees:', err);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching fees',
    });
  }
});
