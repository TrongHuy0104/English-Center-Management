const mongoose = require('mongoose');

const centerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide center name'],
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  teachers: [
    {
      type: mongoose.Schema.ObjectId,
    },
  ],
  classes: [
    {
      type: mongoose.Schema.ObjectId,
    },
  ],
});

const Center = mongoose.model('Center', centerSchema);

module.exports = Center;
