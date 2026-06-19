const express = require('express');
const router = express.Router();
const { getBirthdays, getBirthday, addBirthday, updateBirthday, deleteBirthday } = require('../controllers/birthdayController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getBirthdays);
router.get('/:id', getBirthday);
router.post('/', addBirthday);
router.put('/:id', updateBirthday);
router.delete('/:id', deleteBirthday);

module.exports = router;
