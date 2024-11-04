const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  fee_name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  // Array of classes with status and due date
  classes: [
    {
      _id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Class',
      },
      status: {
        type: String,
        enum: ['complete', 'not yet'],
        default: 'not yet',
      },
      due_date: {
        type: Date,
        required: true,
      },
      create_date: {
        type: Date,
        required: true,
      },
    },
  ],
  // Array of students with status and payment date
  students: [
    {
      _id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Student',
      },
      status: {
        type: String,
        enum: ['paid', 'unpaid', 'partial'],
        default: 'unpaid',
      },
      payment_date: {
        type: Date, // Field for the payment date
      },
    },
  ],
  active: {
    type: Boolean,
    default: true,
  },
});

// Virtual to link to class details
feeSchema.virtual('classDetails', {
  ref: 'Class',
  localField: 'classes._id',
  foreignField: '_id',
  justOne: false,
});

// Virtual to link to student details
feeSchema.virtual('studentDetails', {
  ref: 'Student',
  localField: 'students._id',
  foreignField: '_id',
  justOne: false,
});

feeSchema.set('toJSON', { virtuals: true });
feeSchema.set('toObject', { virtuals: true });

const Fee = mongoose.model('Fee', feeSchema);
module.exports = Fee;
