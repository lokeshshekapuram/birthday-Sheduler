const express = require('express');
const router = express.Router();
const { importCSV, uploadMiddleware } = require('../controllers/csvController');
const { protect } = require('../middleware/auth');

router.post('/import', protect, uploadMiddleware, importCSV);

module.exports = router;
