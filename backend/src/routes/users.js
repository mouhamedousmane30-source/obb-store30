const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  deleteUser
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

router.get('/', protect, adminOnly, getUsers);
router.get('/:id', protect, adminOnly, getUser);
router.put('/profile', protect, uploadSingle('avatar'), updateProfile);
router.post('/address', protect, addAddress);
router.put('/address/:addressId', protect, updateAddress);
router.delete('/address/:addressId', protect, deleteAddress);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;
