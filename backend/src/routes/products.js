const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  getPopularProducts,
  getNewProducts,
  getSimilarProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');
const { uploadMultiple } = require('../middleware/upload');

router.get('/', getProducts);
router.get('/popular/list', getPopularProducts);
router.get('/new/list', getNewProducts);
router.get('/:slug/similar', getSimilarProducts);
router.get('/:slug', getProduct);
router.post('/', protect, adminOnly, uploadMultiple('images', 5), createProduct);
router.put('/:id', protect, adminOnly, uploadMultiple('images', 5), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
