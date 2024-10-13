const Fee = require('../models/feeModel');
const Class = require('../models/classModel');  
const Student = require('../models/studentModel');
const factory = require('./handlerFactory');

// exports.getAllFee = factory.getAll(Fee);
exports.getAllFeeOfStudent = async (req, res, next) => {
    try {
      // Lấy dữ liệu fees và populate thông tin student và class
      const fees = await Fee.find({student: req.user._id})
        .populate('class', 'name');  // Lấy tên của class
        
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

  exports.getScheduleOfStudent = async (req, res, next) => {
    try {
      // Tìm tất cả các lớp mà sinh viên hiện tại đang tham gia
      const classes = await Class.find({
        students: { $in: [req.user._id] }  // Tìm trong mảng students
      }).populate('schedule');
  
      res.status(200).json({
        status: 'success',
        results: classes.length,
        data: {
          classes,
        },
      });
    } catch (err) {
      console.error('Error fetching classes:', err);
      res.status(500).json({
        status: 'error',
        message: 'An error occurred while fetching classes',
      });
    }
  };
  
  
exports.getFeeClass = factory.getOne(Class);
exports.getFee = factory.getOne(Fee);

