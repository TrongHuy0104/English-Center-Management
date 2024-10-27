const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.ObjectId,
  },
  date: {
    type: Date,
  },
  teacher_attendance: {
    teacher_id: {
      type: mongoose.Schema.ObjectId,
      ref: 'Teacher',
    },
    status: {
      type: String,
    },
  },
  student_attendance: [
    {
      student_id: {
        type: mongoose.Schema.ObjectId,
      },
      status: {
        type: String,
      },
    },
  ],
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
