const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  notificationType: {
    type: String,
    required: true,
    enum: ['requestEnroll', 'attendance', 'feePayment', 'general'],
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  center: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Center',
    required: true,
  },
  // admin: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Admin',
  //   required: true,
  // },
  isSeen: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Tạo mô hình Notification
const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
