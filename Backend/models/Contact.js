const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address']
  },
  phone: {
    type: String,
    required: false
  },
  subject: {
    type: String,
    required: true,
    enum: ['general', 'order', 'return', 'shipping', 'product', 'other']
  },
  message: {
    type: String,
    required: true
  },
  orderNumber: {
    type: String,
    required: false
  },
  dateSubmitted: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'resolved'],
    default: 'new'
  },
  notes: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('Contact', contactSchema);