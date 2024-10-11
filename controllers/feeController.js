// controllers/feeController.js
const Fee = require('../models/feeModel');
const factory = require('./handlerFactory');

// Sử dụng các hàm từ handlerFactory
exports.getAllFees = factory.getAll(Fee);
exports.getFee = factory.getOne(Fee);
exports.createFee = factory.createOne(Fee);
exports.updateFee = factory.updateOne(Fee);
exports.deleteFee = factory.deleteOne(Fee);
