const Fee = require('../models/feeModel');
const Class = require('../models/classModel'); 
const catchAsync = require('../utils/catchAsync'); 
const factory = require('./handlerFactory');

exports.getAllFeeOfStudent = catchAsync( async (req, res, next) => {
      // Lấy dữ liệu fees và populate thông tin student và class
      const fees = await Fee.find({student: req.user._id})
        .populate('class', 'name');  // Lấy tên của class
        if (!fees) {
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