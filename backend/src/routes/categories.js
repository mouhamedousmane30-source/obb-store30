const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

router.get('/', getCategories);
router.get('/:slug', getCategory);
router.post('/', protect, adminOnly, uploadSingle('image'), createCategory);
router.put('/:id', protect, adminOnly, uploadSingle('image'), updateCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

module.exports = router;
