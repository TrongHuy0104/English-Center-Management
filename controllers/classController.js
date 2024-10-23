const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const Class = require('../models/classModel');
// Get classes by teacherId
exports.getClassesByTeacherId = catchAsync(async (req, res, next) => {
    const teacherId = req.params.teacherId; 
    console.log('Requested teacherId:', teacherId);
    const classes = await Class.find({ teacher: teacherId }); 
  
    if (classes.length === 0) {
      return next(new AppError('No classes found for this teacher ID', 404)); 
    }
  
    res.status(200).json({
      status: 'success',
      data: {
        classes, 
      },
    });
  });
  