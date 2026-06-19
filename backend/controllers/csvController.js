const Birthday = require('../models/Birthday');
const csv = require('csv-parser');
const multer = require('multer');
const { Readable } = require('stream');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

exports.uploadMiddleware = upload.single('file');

exports.importCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const results = [];
    const errors = [];
    let rowNum = 0;

    const stream = Readable.from(req.file.buffer.toString());
    stream.pipe(csv())
      .on('data', (row) => {
        rowNum++;
        if (!row.Name || !row.Birthday) {
          errors.push(`Row ${rowNum}: Missing Name or Birthday`);
          return;
        }
        const bday = new Date(row.Birthday);
        if (isNaN(bday)) {
          errors.push(`Row ${rowNum}: Invalid date for ${row.Name}`);
          return;
        }
        results.push({
          user: req.user.id,
          name: row.Name.trim(),
          birthday: bday,
          email: row.Email?.trim() || '',
          mobile: row.Mobile?.trim() || '',
          message: row.Message?.trim() || 'Wishing you a wonderful birthday! 🎂',
          relationship: row.Relationship?.toLowerCase() || 'friend'
        });
      })
      .on('end', async () => {
        if (results.length > 0) {
          await Birthday.insertMany(results, { ordered: false });
        }
        res.json({
          success: true,
          message: `Imported ${results.length} birthdays`,
          imported: results.length,
          errors
        });
      })
      .on('error', (err) => {
        res.status(400).json({ success: false, message: 'Error parsing CSV: ' + err.message });
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
