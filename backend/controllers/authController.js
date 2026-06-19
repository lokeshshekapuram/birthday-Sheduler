const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../services/emailService');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
};

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    const user = await User.create({ name, email, password, senderName: name });
    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, senderName: user.senderName }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, senderName: user.senderName, isAdmin: user.isAdmin }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, senderName: user.senderName, isAdmin: user.isAdmin }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No user found with that email' });
    }
    const token = crypto.randomBytes(32).toString('hex');
    await PasswordReset.deleteMany({ user: user._id });
    await PasswordReset.create({ user: user._id, token });
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    const result = await sendPasswordResetEmail(email, resetUrl);
    if (result.success) {
      res.json({ success: true, message: 'Password reset email sent' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to send reset email' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const resetRecord = await PasswordReset.findOne({ token });
    if (!resetRecord || new Date() > resetRecord.expiresAt) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }
    const user = await User.findById(resetRecord.user);
    user.password = password;
    await user.save();
    await PasswordReset.deleteMany({ user: user._id });
    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
