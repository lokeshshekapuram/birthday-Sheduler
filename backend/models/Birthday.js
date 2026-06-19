const mongoose = require('mongoose');

const birthdaySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  birthday: {
    type: Date,
    required: [true, 'Birthday is required']
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  mobile: {
    type: String,
    trim: true
  },
  relationship: {
    type: String,
    enum: ['friend', 'family', 'colleague', 'partner', 'other'],
    default: 'friend'
  },
  message: {
    type: String,
    default: 'Wishing you a wonderful birthday filled with joy and happiness! 🎂',
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  timezone: {
    type: String,
    default: 'Asia/Kolkata'
  },
  imageUrl: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastWishSentYear: {
    type: Number,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Birthday', birthdaySchema);
