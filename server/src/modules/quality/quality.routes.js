const express = require('express');
const router = express.Router();
const qualityController = require('./quality.controller');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const { ROLES, DEPARTMENTS } = require('../../shared/constants');

router.use(authenticate);

// GET /api/v1/quality/events?month=2026-10
router.get('/events', qualityController.getQualityEvents);

// POST /api/v1/quality/events
router.post(
  '/events',
  authorize([ROLES.ADMIN, ROLES.DEPARTMENT_MANAGER], { department: DEPARTMENTS.QUALITY }),
  qualityController.createQualityEvent
);

module.exports = router;

