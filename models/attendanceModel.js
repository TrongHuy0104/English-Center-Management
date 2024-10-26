const mongoose = require('mongoose');

const slotTimeMapping = {
  1: { start_time: '07:00', end_time: '08:30' },
  2: { start_time: '08:45', end_time: '10:15' },
  3: { start_time: '10:30', end_time: '12:00' },
  4: { start_time: '12:30', end_time: '14:00' },
  5: { start_time: '14:15', end_time: '15:45' },
  6: { start_time: '16:00', end_time: '17:30' },
  7: { start_time: '18:00', end_time: '19:30' },
  8: { start_time: '19:45', end_time: '21:15' }
};

const attendanceSchema = new mongoose.Schema({
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    slot: {
        type: Number,
        required: true,
        enum: [1, 2, 3, 4, 5, 6, 7, 8],
    },
    start_time: {
        type: String,
    },
    end_time: {
        type: String,
    },
    teacher_attendance: {
        teacher_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teacher',
            required: true,
        },
        status: {
            type: String,
            enum: ['present', 'absent'],
            default: 'present',
        },
    },
    student_attendance: [{
        student_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
        },
        status: {
            type: String,
            enum: ['present', 'absent'],
            required: true,
        },
    }],
});

// Middleware để tự động gán start_time và end_time dựa vào slot
attendanceSchema.pre('save', function (next) {
    const slotTimes = slotTimeMapping[this.slot];
    if (slotTimes) {
        this.start_time = slotTimes.start_time;
        this.end_time = slotTimes.end_time;
    }
    next();
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
