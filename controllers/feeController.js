// controllers/feeController.js
const Fee = require('../models/feeModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const Class = require('../models/classModel');
const AppError = require('../utils/appError');

// use funtcion from handlerFactory
// exports.getAllFees = factory.getAll(Fee);
// exports.getFee = factory.getOne(Fee);
exports.createFee = factory.createOne(Fee);
// exports.createFee = factory.createOne(Fee);
exports.updateFee = factory.updateOne(Fee);
exports.deleteFee = catchAsync(async (req, res, next) => {
  await Fee.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const mongoose = require('mongoose');

exports.createClassInFee = async (req, res) => {
  try {
    const { class_id, status, due_date, create_date } = req.body;
    const feeId = req.params.id;

    // Tìm phí theo ID
    const fee = await Fee.findById(feeId);
    if (!fee) {
      return res.status(404).json({ message: 'Fee not found' });
    }

    // // Kiểm tra xem lớp học đã tồn tại chưa
    // const classExists = fee.classes.some(
    //   (existingClass) => existingClass._id.toString() === class_id,
    // );

    // if (classExists) {
    //   return res
    //     .status(400)
    //     .json({ message: 'Class already exists in this fee' });
    // }

    // // Tạo lớp học mới với ObjectId
    // const newClass = {
    //   _id: new mongoose.Types.ObjectId(class_id), // Chuyển class_id thành ObjectId
    //   status,
    //   due_date,
    //   create_date,
    // };

    // Kiểm tra xem lớp học đã tồn tại chưa
    const classExists = fee.classes.some(
      (existingClass) => existingClass._id.toString() === class_id,
    );

    if (classExists) {
      return res
        .status(400)
        .json({ message: 'Class already exists in this fee' });
    }

    // Thêm lớp vào mà không tạo ID mới, sử dụng ID đã chọn từ frontend
    const newClass = {
      _id: class_id, // Sử dụng đúng ID từ frontend
      status,
      due_date,
      create_date,
    };

    // Thêm lớp học vào danh sách lớp của phí
    fee.classes.push(newClass);

    // Lưu phí sau khi cập nhật
    await fee.save();

    res.status(201).json({
      status: 'success',
      data: fee,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.getAllFees = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Lấy page và limit từ query params
    const skip = (page - 1) * limit; // Tính toán số mục cần bỏ qua

    // Tìm các phí với phân trang
    const fees = await Fee.find({ active: true })
      .skip(skip) // Bỏ qua số mục dựa trên trang hiện tại
      .limit(Number(limit)); // Lấy số mục cho trang hiện tại

    const totalFees = await Fee.countDocuments({ active: true }); // Đếm tổng số tài liệu

    res.status(200).json({
      status: 'success',
      results: fees.length,
      total: totalFees,
      currentPage: Number(page),
      totalPages: Math.ceil(totalFees / limit),
      fees,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.getFee = catchAsync(async (req, res, next) => {
  const fee = await Fee.findById(req.params.id)
    .populate('classDetails')
    .populate('studentDetails');

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

exports.deleteClassInFee = async (req, res) => {
  // const { feeId, classId } = req.params;

  try {
    // Tìm kiếm fee bằng feeId trong cơ sở dữ liệu
    const fee = await Fee.findById(req.params.id);

    if (!fee) {
      return res.status(404).json({ message: 'Fee not found' });
    }

    // Xóa class khỏi danh sách classes trong fee
    fee.classes = fee.classes.filter(
      (cls) => cls._id && cls._id.toString() !== req.params.classId,
    );

    // Lưu lại fee sau khi cập nhật
    await fee.save();

    res.status(200).json({
      status: 'success',
      message: 'Class deleted successfully',
      data: fee,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error deleting class',
      error: error.message,
    });
  }
};
