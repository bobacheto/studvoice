const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { generalLimiter } = require('../middleware/rateLimiter');

// Register
router.post('/register', generalLimiter, (req, res, next) => {
  authController.register(req, res, next);
});

// Login
router.post('/login', generalLimiter, (req, res, next) => {
  authController.login(req, res, next);
});

// Profile (protected)
router.get('/profile', authMiddleware, (req, res, next) => {
  authController.getProfile(req, res, next);
});

module.exports = router;
