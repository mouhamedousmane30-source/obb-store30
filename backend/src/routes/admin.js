const express = require('express');
const router = express.Router();
const {
  getStats,
  getRecentOrders,
  getBestProducts,
  getMonthlySales,
  getCategorySales,
  getSalesAnalytics,
  getCategoryAnalytics,
  getInventory,
  getAdminProducts,
  getAdminProduct,
  toggleProduct,
  updateUser,
  getDashboardSummary
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// Dashboard
router.get('/stats', protect, adminOnly, getStats);
router.get('/dashboard/summary', protect, adminOnly, getDashboardSummary);
router.get('/dashboard/recent-orders', protect, adminOnly, getRecentOrders);
router.get('/dashboard/best-products', protect, adminOnly, getBestProducts);
router.get('/dashboard/monthly-sales', protect, adminOnly, getMonthlySales);
router.get('/dashboard/category-sales', protect, adminOnly, getCategorySales);

// Analytics
router.get('/analytics/sales', protect, adminOnly, getSalesAnalytics);
router.get('/analytics/categories', protect, adminOnly, getCategoryAnalytics);

// Inventory
router.get('/inventory', protect, adminOnly, getInventory);

// Products management
router.get('/products', protect, adminOnly, getAdminProducts);
router.get('/products/:id', protect, adminOnly, getAdminProduct);
router.put('/products/:id/toggle', protect, adminOnly, toggleProduct);

// Users management
router.put('/users/:id', protect, adminOnly, updateUser);

module.exports = router;
