const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// Environment check middleware
const allowDevOnly = (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ message: 'Registration is disabled in production. Please contact an administrator.' });
  }
  next();
};

// Register - only allowed in development
router.post('/register', allowDevOnly, authController.register);

// Login
router.post('/login', authController.login);

// Logout - protected route
router.post('/logout', protect, authController.logout);

// Get current user
router.get('/me', protect, authController.getMe);

module.exports = router; 