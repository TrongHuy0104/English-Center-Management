const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Teacher',
  },
  month: {
    type: String,
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
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

const Salary = mongoose.model('Salary', salarySchema);
module.exports = Salary;
