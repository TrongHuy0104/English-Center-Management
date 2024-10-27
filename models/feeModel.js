const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  fee_name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  // Thêm ObjectId cho classes và status của từng class
  classes: [
    {
      _id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Class',
      },
      status: {
        type: String,
        enum: ['complete', 'not yet'],
        default: 'not yet',
      },
      due_date: {
        type: Date,
        required: true,
      },
      create_date: {
        type: Date,
        required: true,
      },
    },
  ],
  // Thêm ObjectId cho students và status của từng student
  students: [
    {
      _id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Student',
      },
      status: {
        type: String,
        enum: ['paid', 'unpaid', 'partial'],
        default: 'unpaid',
      },
    },
  ],
});

// Virtual để liên kết với các chi tiết lớp học
feeSchema.virtual('classDetails', {
  ref: 'Class',
  localField: 'classes._id',
  foreignField: '_id',
  justOne: false,
});

// Virtual để liên kết với chi tiết sinh viên
feeSchema.virtual('studentDetails', {
  ref: 'Student',
  localField: 'students._id',
  foreignField: '_id',
  justOne: false,
});

feeSchema.set('toJSON', { virtuals: true });
feeSchema.set('toObject', { virtuals: true });

const Fee = mongoose.model('Fee', feeSchema);
module.exports = Fee;
