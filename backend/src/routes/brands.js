const express = require('express');
const router = express.Router();
const {
  getBrands,
  getAllBrands,
  createBrand,
  updateBrand,
  deleteBrand
} = require('../controllers/brandController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getBrands);
router.get('/all', protect, adminOnly, getAllBrands);
router.post('/', protect, adminOnly, createBrand);
router.put('/:id', protect, adminOnly, updateBrand);
router.delete('/:id', protect, adminOnly, deleteBrand);

module.exports = router;
