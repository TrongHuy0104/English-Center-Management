// controllers/feeController.js
const Salary = require('../models/salaryModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

// use funtcion from handlerFactory
// exports.getAllSalaries = factory.getAll(Salary);
// exports.getSalary = factory.getOne(Salary);
exports.createSalary = factory.createOne(Salary);
exports.updateSalary = factory.updateOne(Salary);

exports.deleteSalary = catchAsync(async (req, res, next) => {
  await Salary.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getAllSalaries = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Lấy page và limit từ query params
    const skip = (page - 1) * limit; // Tính toán số mục cần bỏ qua

    // Tìm các phí với phân trang
    const salaries = await Salary.find({ active: true })
      .populate('teacher', 'name shiftPay ')
      .skip(skip) // Bỏ qua số mục dựa trên trang hiện tại
      .limit(Number(limit)); // Lấy số mục cho trang hiện tại

    const totalSalaries = await Salary.countDocuments({ active: true }); // Đếm tổng số tài liệu

    res.status(200).json({
      status: 'success',
      results: salaries.length,
      total: totalSalaries,
      currentPage: Number(page),
      totalPages: Math.ceil(totalSalaries / limit),
      salaries,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.getSalary = catchAsync(async (req, res, next) => {
  const salaries = await Salary.findById(req.params.id).populate(
    'teacher',
    'name shiftPay ',
  );

  res.status(200).json({
    status: 'success',
    results: salaries.length,
    data: {
      salaries,
    },
  });
});

exports.getSalaryByTeacherId = catchAsync(async (req, res, next) => {
  const salaryData = await Salary.find({ teacher: req.params.teacherId });

  if (!salaryData || salaryData.length === 0) {
    return next(new AppError('No salary data found for this teacher.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: salaryData,
    },
  });
});
