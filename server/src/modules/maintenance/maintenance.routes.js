const express = require('express');
const router = express.Router();
const maintenanceController = require('./maintenance.controller');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const { ROLES } = require('../../shared/constants');

router.use(authenticate);

// GET /api/v1/maintenance/tickets
router.get('/tickets', maintenanceController.getTickets);

// POST /api/v1/maintenance/tickets
router.post('/tickets', maintenanceController.createTicket);

// PATCH /api/v1/maintenance/tickets/:id/status
router.patch('/tickets/:id/status', authorize([ROLES.ADMIN, ROLES.DEPARTMENT_MANAGER]), maintenanceController.updateTicketStatus);

module.exports = router;
