const express = require('express');
const router = express.Router();
const {
  subscribe,
  unsubscribe,
  getSubscribers
} = require('../controllers/newsletterController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', subscribe);
router.delete('/:email', unsubscribe);
router.get('/', protect, adminOnly, getSubscribers);

module.exports = router;
