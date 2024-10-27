const mongoose = require('mongoose');

const slotTimeMapping = {
  1: { start_time: '07:00', end_time: '08:30' },
  2: { start_time: '08:45', end_time: '10:15' },
  3: { start_time: '10:30', end_time: '12:00' },
  4: { start_time: '12:30', end_time: '14:00' },
  5: { start_time: '14:15', end_time: '15:45' },
  6: { start_time: '16:00', end_time: '17:30' },
  7: { start_time: '18:00', end_time: '19:30' },
  8: { start_time: '19:45', end_time: '21:15' },
};

const scheduleSchema = new mongoose.Schema({
  date: {
    type: Date, // Ngày tháng năm cụ thể
    required: true,
  },
  dayOfWeek: {
    type: String, // Thứ trong tuần
    required: true,
    enum: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
  },
  slot: {
    type: Number, // Số slot trong ngày (1-8)
    required: true,
    enum: [1, 2, 3, 4, 5, 6, 7, 8],
  },
  start_time: {
    type: String, // Giờ bắt đầu (sẽ tự động được gán dựa vào slot)
  },
  end_time: {
    type: String, // Giờ kết thúc (sẽ tự động được gán dựa vào slot)
  },
});

// Middleware để tự động gán giờ cho slot
scheduleSchema.pre('save', function (next) {
  const slotTimes = slotTimeMapping[this.slot];
  if (slotTimes) {
    this.start_time = slotTimes.start_time;
    this.end_time = slotTimes.end_time;
  }
  next();
});

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your class name'],
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
  schedule: [scheduleSchema], // Sử dụng schema riêng cho schedule
});

const Class = mongoose.model('Class', classSchema);
module.exports = Class;
