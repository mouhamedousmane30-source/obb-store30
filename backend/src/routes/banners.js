const express = require('express');
const router = express.Router();
const {
  getBanners,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner
} = require('../controllers/bannerController');
const { protect, adminOnly } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

router.get('/', getBanners);
router.get('/all', protect, adminOnly, getAllBanners);
router.post('/', protect, adminOnly, uploadSingle('image'), createBanner);
router.put('/:id', protect, adminOnly, uploadSingle('image'), updateBanner);
router.delete('/:id', protect, adminOnly, deleteBanner);

module.exports = router;
