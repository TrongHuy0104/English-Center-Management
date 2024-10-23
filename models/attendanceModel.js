const mongoose = require('mongoose');

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

// Sau đó, bạn cần phải tạo model từ schema
const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
