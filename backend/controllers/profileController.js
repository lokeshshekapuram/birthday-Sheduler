const User = require('../models/User');

exports.updateProfile = async (req, res) => {
  try {
    const { name, senderName, smtpSettings } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, senderName, smtpSettings },
      { new: true, runValidators: true }
    );
    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, senderName: user.senderName }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
