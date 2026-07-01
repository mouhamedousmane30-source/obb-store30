const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings,
  getPublicSettings
} = require('../controllers/settingController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/public', getPublicSettings);
router.get('/', protect, adminOnly, getSettings);
router.put('/', protect, adminOnly, updateSettings);

module.exports = router;
