const express = require('express');
const router = express.Router();
const violationsController = require('./violations.controller');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const { ROLES } = require('../../shared/constants');

router.use(authenticate);

// GET /api/v1/violations?month=2026-10
router.get('/', violationsController.getViolations);

// POST /api/v1/violations
router.post('/', authorize([ROLES.ADMIN]), violationsController.createViolation);

module.exports = router;
