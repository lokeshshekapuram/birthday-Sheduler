const Birthday = require('../models/Birthday');

// Get all birthdays
exports.getBirthdays = async (req, res) => {
  try {
    const { search, relationship, sort, active } = req.query;
    let query = { user: req.user.id };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (relationship && relationship !== 'all') query.relationship = relationship;
    if (active !== undefined) query.isActive = active === 'true';

    let sortOption = { createdAt: -1 };
    if (sort === 'name') sortOption = { name: 1 };
    if (sort === 'birthday') sortOption = { birthday: 1 };

    const birthdays = await Birthday.find(query).sort(sortOption);

    const today = new Date();
    const enriched = birthdays.map(b => {
      const bdayObj = b.toObject();
      const bdate = new Date(b.birthday);
      const age = today.getFullYear() - bdate.getFullYear();
      const nextBirthday = new Date(today.getFullYear(), bdate.getMonth(), bdate.getDate());
      if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);
      const daysUntil = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
      return { ...bdayObj, age, daysUntil };
    });

    res.json({ success: true, count: birthdays.length, birthdays: enriched });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single birthday
exports.getBirthday = async (req, res) => {
  try {
    const birthday = await Birthday.findOne({ _id: req.params.id, user: req.user.id });
    if (!birthday) return res.status(404).json({ success: false, message: 'Birthday not found' });
    res.json({ success: true, birthday });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add birthday
exports.addBirthday = async (req, res) => {
  try {
    const birthday = await Birthday.create({ ...req.body, user: req.user.id });
    res.status(201).json({ success: true, birthday });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update birthday
exports.updateBirthday = async (req, res) => {
  try {
    const birthday = await Birthday.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!birthday) return res.status(404).json({ success: false, message: 'Birthday not found' });
    res.json({ success: true, birthday });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete birthday
exports.deleteBirthday = async (req, res) => {
  try {
    const birthday = await Birthday.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!birthday) return res.status(404).json({ success: false, message: 'Birthday not found' });
    res.json({ success: true, message: 'Birthday deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
