// controllers/feeController.js
const Fee = require('../models/feeModel');
const factory = require('./handlerFactory');

// Sử dụng các hàm từ handlerFactory
// exports.getAllFees = factory.getAll(Fee);
exports.getFee = factory.getOne(Fee);
exports.createFee = factory.createOne(Fee);
exports.updateFee = factory.updateOne(Fee);
exports.deleteFee = factory.deleteOne(Fee);

exports.getAllFees = async (req, res, next) => {
  try {
    // Lấy dữ liệu fees và populate thông tin student và class
    const fees = await Fee.find().populate('student', 'name phone'); // Lấy tên của class

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
};
