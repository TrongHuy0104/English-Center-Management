const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
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
  managedCenterIds: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Center',
    },
  ],
  isSuperAdmin: {
    type: Boolean,
    default: false,
  },
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
