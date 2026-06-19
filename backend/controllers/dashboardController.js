const Birthday = require('../models/Birthday');
const Notification = require('../models/Notification');

exports.getDashboard = async (req, res) => {
  try {
    const today = new Date();
    const currentYear = today.getFullYear();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();

    const allBirthdays = await Birthday.find({ user: req.user.id, isActive: true });

    // Today's birthdays
    const todayBirthdays = allBirthdays.filter(b => {
      const d = new Date(b.birthday);
      return d.getMonth() + 1 === todayMonth && d.getDate() === todayDay;
    });

    // Upcoming in next 30 days
    const upcoming = allBirthdays
      .map(b => {
        const bdate = new Date(b.birthday);
        const next = new Date(currentYear, bdate.getMonth(), bdate.getDate());
        if (next < today) next.setFullYear(currentYear + 1);
        const days = Math.ceil((next - today) / (1000 * 60 * 60 * 24));
        return { ...b.toObject(), daysUntil: days };
      })
      .filter(b => b.daysUntil > 0 && b.daysUntil <= 30)
      .sort((a, b) => a.daysUntil - b.daysUntil);

    const sentThisYear = await Notification.countDocuments({
      user: req.user.id,
      year: currentYear,
      status: 'success'
    });

    res.json({
      success: true,
      stats: {
        totalContacts: allBirthdays.length,
        todayCount: todayBirthdays.length,
        upcomingCount: upcoming.length,
        sentThisYear
      },
      todayBirthdays,
      upcomingBirthdays: upcoming.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
