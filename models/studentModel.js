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
  
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
// Virtual populate review
studentSchema.virtual('user', {
  ref: 'User',
  foreignField: 'role_id',
  localField: '_id',
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;