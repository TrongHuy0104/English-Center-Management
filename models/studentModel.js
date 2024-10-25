const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
  },
  phone: {
    type: String,
    // required: [true, 'Please provide your phone number'],
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  dateOfBirth: Date,
  centers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Center',
    },
  ],
  classes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Class',
    },
  ],
  attendances: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Attendance',
    },
  ],
  fees: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Fee',
    },
  ],
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
