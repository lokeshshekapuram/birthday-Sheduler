const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, year } = req.query;
    let query = { user: req.user.id };
    if (status && status !== 'all') query.status = status;
    if (year) query.year = parseInt(year);

    const total = await Notification.countDocuments(query);
    const notifications = await Notification.find(query)
      .sort({ sentAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      notifications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
