const express = require('express');
const router = express.Router();
const productionController = require('./production.controller');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const { ROLES } = require('../../shared/constants');

router.use(authenticate);

// GET /api/v1/production/orders
router.get('/orders', productionController.getOrders);

// POST /api/v1/production/orders
router.post('/orders', authorize([ROLES.ADMIN, ROLES.DEPARTMENT_MANAGER]), productionController.createOrder);

// PATCH /api/v1/production/orders/:id/stages/:stageKey
router.patch('/orders/:id/stages/:stageKey', authorize([ROLES.ADMIN, ROLES.DEPARTMENT_MANAGER, ROLES.DEPARTMENT_MEMBER]), productionController.updateStage);

module.exports = router;
