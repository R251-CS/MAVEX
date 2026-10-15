const express = require('express');
const router = express.Router();
const dashboardController = require('./dashboard.controller');
const authenticate = require('../../middleware/authenticate');

// GET /api/v1/dashboard?month=2026-10
router.get('/', authenticate, dashboardController.getDashboard);

module.exports = router;
