const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const authenticate = require('../../middleware/authenticate');

/**
 * POST /api/v1/auth/login
 * Validates credentials against MongoDB and returns JWT
 */
router.post('/login', authController.login);

/**
 * POST /api/v1/auth/register
 * Creates a new user in MongoDB with bcrypt hashed password
 */
router.post('/register', authController.register);

/**
 * GET /api/v1/auth/me
 * Returns current authenticated user profile
 */
router.get('/me', authenticate, authController.getMe);

module.exports = router;
