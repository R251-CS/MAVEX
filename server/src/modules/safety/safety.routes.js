const express = require('express');
const router = express.Router();
const safetyController = require('./safety.controller');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const { ROLES } = require('../../shared/constants');

router.use(authenticate);

// GET /api/v1/safety/incidents
router.get('/incidents', safetyController.getIncidents);

// POST /api/v1/safety/incidents
router.post('/incidents', safetyController.createIncident);

module.exports = router;
