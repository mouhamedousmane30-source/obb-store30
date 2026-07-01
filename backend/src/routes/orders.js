const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getMyOrders,
  getOrder,
  getOrderReceipt,
  updateOrder,
  cancelOrder
} = require('../controllers/orderController');
const { createOrderValidation } = require('../validations/orderValidation');
const { protect, adminOnly, optionalProtect } = require('../middleware/auth');

router.post('/', optionalProtect, createOrderValidation, createOrder);
router.get('/receipt', getOrderReceipt);
router.get('/', protect, adminOnly, getOrders);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrder);
router.put('/:id', protect, adminOnly, updateOrder);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;
