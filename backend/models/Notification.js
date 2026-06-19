const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  birthday: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Birthday'
  },
  contactName: {
    type: String,
    required: true
  },
  contactEmail: {
    type: String
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['success', 'failed'],
    required: true
  },
  method: {
    type: String,
    enum: ['email', 'sms'],
    default: 'email'
  },
  error: {
    type: String,
    default: null
  },
  year: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Notification', notificationSchema);
