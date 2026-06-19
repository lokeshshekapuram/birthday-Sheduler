const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const { scheduleBirthdayChecker } = require('./cron/birthdayChecker');

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/birthdays', require('./routes/birthday'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/notifications', require('./routes/notification'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/csv', require('./routes/csv'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Birthday Scheduler API is running!', status: 'ok' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    // Start the birthday checker cron job
    scheduleBirthdayChecker();
    console.log('✅ Birthday scheduler started');
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
