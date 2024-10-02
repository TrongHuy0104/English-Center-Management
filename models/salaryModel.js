const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  shifts: {
    type: Number,
    required: true,
  },
  calculatedSalary: {
    type: Number,
    required: true,
  },
  shiftPay: {
    type: Number,
    required: true,
  },
  paid: {
    type: Boolean,
    default: false,
  },
  paymentDate: Date,
});

const Salary = mongoose.model('Salary', salarySchema);
module.exports = Salary;
