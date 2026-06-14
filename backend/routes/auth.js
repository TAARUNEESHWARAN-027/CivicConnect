// ==============================
// Authentication Routes
// ==============================
// Defines API endpoints for user authentication.

const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// POST /api/auth/register - Create a new account
router.post('/register', register);

// POST /api/auth/login - Log in to an existing account
router.post('/login', login);

// GET /api/auth/me - Get current user's profile (protected)
router.get('/me', authenticate, getMe);

module.exports = router;
