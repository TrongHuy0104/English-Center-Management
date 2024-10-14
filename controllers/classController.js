const Class = require('../models/classModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// Hàm lấy dữ liệu lớp học theo classId
exports.getClassById = catchAsync(async (req, res, next) => {
    const classData = await Class.findById(req.params.id);
    console.log(req.params.id);
    
    if (!classData) {
      return next(new AppError('No class found with that ID', 404));
    }
    //no nhay vao !classData
    res.status(200).json({
        status: 'success',
        data: {
            class: classData,
        }
    });
});


exports.getClassById = factory.getOne(Class);
exports.getAllClasses = factory.getAll(Class);  