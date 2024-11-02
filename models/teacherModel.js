const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
    },
    phone: {
      type: String,
      required: [true, 'Please provide your phone number'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    dateOfBirth: Date,
    classes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Class',
      },
    ],
    salary: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Salary',
      },
    ],
    attendances: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Attendance',
      },
    ],
    shiftPay: {
      type: Number,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

teacherSchema.virtual('user', {
  ref: 'User',
  foreignField: 'role_id',
  localField: '_id',
});

const Teacher = mongoose.model('Teacher', teacherSchema);
module.exports = Teacher;
