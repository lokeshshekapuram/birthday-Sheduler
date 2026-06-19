const cron = require('node-cron');
const Birthday = require('../models/Birthday');
const Notification = require('../models/Notification');
const { sendBirthdayEmail } = require('../services/emailService');

const checkAndSendBirthdays = async () => {
  console.log('🔍 Checking birthdays...', new Date().toISOString());
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const todayMonth = now.getMonth() + 1;
    const todayDate = now.getDate();

    const birthdays = await Birthday.find({
      isActive: true,
      email: { $exists: true, $ne: '' },
      $or: [
        { lastWishSentYear: { $ne: currentYear } },
        { lastWishSentYear: null }
      ]
    }).populate('user', 'name senderName smtpSettings');

    console.log(`📋 Found ${birthdays.length} active birthdays to check`);

    for (const bday of birthdays) {
      const bdayDate = new Date(bday.birthday);
      const bdayMonth = bdayDate.getMonth() + 1;
      const bdayDay = bdayDate.getDate();

      if (bdayMonth === todayMonth && bdayDay === todayDate) {
        console.log(`🎂 Today is ${bday.name}'s birthday! Sending wish...`);
        const user = bday.user;
        const senderName = user.senderName || user.name || 'A Friend';
        const smtpSettings = user.smtpSettings?.useCustom ? user.smtpSettings : null;

        const result = await sendBirthdayEmail(
          bday.email,
          bday.name,
          bday.message,
          senderName,
          smtpSettings
        );

        await Notification.create({
          user: user._id,
          birthday: bday._id,
          contactName: bday.name,
          contactEmail: bday.email,
          status: result.success ? 'success' : 'failed',
          method: 'email',
          error: result.error || null,
          year: currentYear
        });

        if (result.success) {
          await Birthday.findByIdAndUpdate(bday._id, { lastWishSentYear: currentYear });
          console.log(`✅ Wish sent to ${bday.name} (${bday.email})`);
        } else {
          console.log(`❌ Failed to send to ${bday.name}: ${result.error}`);
        }
      }
    }
    console.log('✅ Birthday check complete');
  } catch (error) {
    console.error('❌ Error in birthday checker:', error);
  }
};

const scheduleBirthdayChecker = () => {
  // Run every hour
  cron.schedule('0 * * * *', checkAndSendBirthdays);
  console.log('⏰ Birthday checker scheduled (runs every hour)');
  // Also run once on startup
  checkAndSendBirthdays();
};

module.exports = { scheduleBirthdayChecker, checkAndSendBirthdays };
