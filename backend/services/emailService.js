const nodemailer = require('nodemailer');

const createTransporter = (smtpSettings) => {
  if (smtpSettings && smtpSettings.useCustom && smtpSettings.user) {
    return nodemailer.createTransport({
      host: smtpSettings.host,
      port: smtpSettings.port,
      secure: smtpSettings.port === 465,
      auth: { user: smtpSettings.user, pass: smtpSettings.pass }
    });
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const getBirthdayEmailTemplate = (friendName, message, senderName) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Happy Birthday!</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f4ff; }
    .container { max-width: 600px; margin: 30px auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 30px; text-align: center; }
    .emoji { font-size: 70px; margin-bottom: 15px; display: block; }
    .header h1 { color: white; font-size: 42px; font-weight: 700; text-shadow: 0 2px 10px rgba(0,0,0,0.2); }
    .header p { color: rgba(255,255,255,0.9); font-size: 20px; margin-top: 8px; }
    .content { padding: 40px 35px; }
    .greeting { font-size: 26px; font-weight: 600; color: #2d3748; margin-bottom: 20px; }
    .message-box { background: linear-gradient(135deg, #f5f7ff 0%, #ede9fe 100%); border-left: 5px solid #764ba2; border-radius: 10px; padding: 25px; margin: 25px 0; }
    .message-box p { font-size: 17px; line-height: 1.8; color: #4a5568; font-style: italic; }
    .decorations { display: flex; justify-content: center; gap: 10px; font-size: 30px; margin: 25px 0; }
    .sender { text-align: center; margin-top: 30px; }
    .sender p { color: #718096; font-size: 15px; }
    .sender strong { color: #667eea; font-size: 18px; }
    .footer { background: #f7fafc; padding: 20px; text-align: center; }
    .footer p { color: #a0aec0; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="emoji">🎂</span>
      <h1>Happy Birthday!</h1>
      <p>Wishing you the most wonderful day</p>
    </div>
    <div class="content">
      <p class="greeting">Dear ${friendName},</p>
      <div class="message-box">
        <p>${message}</p>
      </div>
      <div class="decorations">🎉 🎈 🎁 🌟 🎊</div>
      <div class="sender">
        <p>With love and warm wishes,</p>
        <strong>${senderName}</strong>
      </div>
    </div>
    <div class="footer">
      <p>This birthday wish was sent automatically via Birthday Wish Scheduler 🎂</p>
    </div>
  </div>
</body>
</html>`;
};

const sendBirthdayEmail = async (to, friendName, message, senderName, smtpSettings) => {
  try {
    const transporter = createTransporter(smtpSettings);
    const html = getBirthdayEmailTemplate(friendName, message, senderName || process.env.SENDER_NAME || 'A Friend');
    const fromEmail = smtpSettings?.useCustom ? smtpSettings.user : process.env.EMAIL_USER;

    const mailOptions = {
      from: `"${senderName || process.env.SENDER_NAME || 'Birthday Wishes'}" <${fromEmail}>`,
      to,
      subject: `🎂 Happy Birthday, ${friendName}! 🎉`,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Birthday email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

const sendPasswordResetEmail = async (to, resetUrl) => {
  try {
    const transporter = createTransporter(null);
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background: #f0f4ff;">
        <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <h2 style="color: #667eea; margin-bottom: 16px;">🔐 Password Reset</h2>
          <p style="color: #4a5568; line-height: 1.6; margin-bottom: 24px;">Click the button below to reset your password. This link expires in 1 hour.</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Reset My Password</a>
          <p style="color: #a0aec0; font-size: 13px; margin-top: 24px;">If you didn't request this, please ignore this email.</p>
        </div>
      </div>`;

    await transporter.sendMail({
      from: `"Birthday Scheduler" <${process.env.EMAIL_USER}>`,
      to,
      subject: '🔐 Password Reset - Birthday Scheduler',
      html
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

module.exports = { sendBirthdayEmail, sendPasswordResetEmail };
