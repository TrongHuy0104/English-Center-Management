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
  classes: [
    {
      type: Array,
      ref: 'Class',
    },
  ],
  students: [
    {
      type: Array,
      ref: 'Student',
    },
  ],
});

feeSchema.virtual('classDetails', {
  ref: 'Class',
  localField: 'classes._id',
  foreignField: '_id',
  justOne: false,
});

feeSchema.set('toJSON', { virtuals: true });
feeSchema.set('toObject', { virtuals: true });

const Fee = mongoose.model('Fee', feeSchema);
module.exports = Fee;
