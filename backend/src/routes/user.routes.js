const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Admin and manager can access users list
router.get('/', protect, authorize('admin', 'manager'), userController.getUsers);

// Authenticated users
router.get('/profile', protect, userController.getUserProfile);

// Admin only
router.get('/:id', protect, authorize('admin'), userController.getUserById);

// Admin only - create new user
router.post('/', protect, authorize('admin'), userController.createUser);

module.exports = router; 