const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your class name'],
  },
  center: {
    type: mongoose.Schema.ObjectId,
    ref: 'Center',
  },
  teacher: {
    type: mongoose.Schema.ObjectId,
    ref: 'Teacher',
  },
  students: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Student',
    },
  ],
  schedule: [
    {
      day: {
        type: String,
        required: true,
      },
      start_time: {
        type: String,
        required: true,
      },
      end_time: {
        type: String,
        required: true,
      },
    },
  ],
});

const Class = mongoose.model('Class', classSchema);
module.exports = Class;
