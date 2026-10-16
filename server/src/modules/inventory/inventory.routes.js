const express = require('express');
const router = express.Router();
const inventoryController = require('./inventory.controller');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const { ROLES } = require('../../shared/constants');

router.use(authenticate);

// GET /api/v1/inventory/items
router.get('/items', inventoryController.getItems);

// GET /api/v1/inventory/movements (FR-16)
router.get('/movements', inventoryController.getMovements);

// GET /api/v1/inventory/warehouses
router.get('/warehouses', inventoryController.getWarehouses);

// POST /api/v1/inventory/movements (FR-14)
router.post('/movements', authorize([ROLES.ADMIN, ROLES.DEPARTMENT_MANAGER, ROLES.DEPARTMENT_MEMBER]), inventoryController.createMovement);

module.exports = router;
