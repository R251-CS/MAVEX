const express = require('express');
const router = express.Router();
const financeController = require('./finance.controller');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const { ROLES } = require('../../shared/constants');

router.use(authenticate);

// GET /api/v1/finance/payroll?month=2026-10 (Admin only)
router.get('/payroll', authorize([ROLES.ADMIN]), financeController.getPayroll);

// GET /api/v1/finance/parties?type=customer (Admin only)
router.get('/parties', authorize([ROLES.ADMIN]), financeController.getParties);

// GET /api/v1/finance/transactions?partyId=xyz (Admin only)
router.get('/transactions', authorize([ROLES.ADMIN]), financeController.getTransactions);

module.exports = router;
