const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
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
      default: 'male',
    },
    dateOfBirth: Date,
    centers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Center',
      },
    ],
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual populate review
adminSchema.virtual('user', {
  ref: 'User',
  foreignField: 'role_id',
  localField: '_id',
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
