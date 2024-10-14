const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.ObjectId,
  },
  student: {
    type: mongoose.Schema.ObjectId,
    ref: 'Student',
  },
  amount: {
    type: Number,
  },
  due_date: {
    type: Date,
  },
  paid: {
    type: Boolean,
  },
  payment_date: {
    type: Date,
  },
});

const Fee = mongoose.model('Fee', feeSchema);
module.exports = Fee;
