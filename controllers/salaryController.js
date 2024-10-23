const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const salaryModel = require('../models/salaryModel');
  
  //Get salary by teacherId
  exports.getSalaryByTeacherId = catchAsync(async (req, res, next) => {
    const salaryData = await salaryModel.find({ teacher: req.params.teacherId }); 
  
    if (!salaryData || salaryData.length === 0) {
      return next(new AppError("No salary data found for this teacher.", 404));
    }
  
   
    res.status(200).json({
      status: "success",
      data: {
        data: salaryData,
      },
    });
  });