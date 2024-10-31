const Fee = require('../models/feeModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getAllFees = factory.getAll(Fee);
exports.createFee = factory.createOne(Fee);
exports.updateFee = factory.updateOne(Fee);
exports.deleteFee = factory.deleteOne(Fee);

// Helper function for pagination
const paginate = (array, page_size, page_number) => {
  const start = (page_number - 1) * page_size;
  const end = start + page_size;
  return array.slice(start, end);
};

// Get all fees of a student with pagination
exports.getAllFeeOfStudent = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, status = 'all' } = req.query;
  
  // Fetch fees related to the student ID
  const allFees = await Fee.find({ 'students._id': req.user.role_id }).populate('classDetails');
  
  if (!allFees || allFees.length === 0) {
    return next(new AppError('No fees found with that student ID', 404));
  }

  // Filter based on status
  let filterFees;
  if (status === 'all') {
    filterFees = allFees;
  } else {
    filterFees = allFees.filter(fee => {
      return fee.students.some(student => student.status === status && student._id.equals(req.user.role_id));
    });
  }

  // Paginate the filtered fees
  const fees = paginate(filterFees, +limit, +page);

  // Send paginated response
  res.status(200).json({
    status: 'success',
    results: filterFees.length,
    data: {
      fees: fees,
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
