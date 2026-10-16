const express = require('express');
const router = express.Router();
const financeController = require('./finance.controller');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const { ROLES } = require('../../shared/constants');

router.use(authenticate);

// GET /api/v1/finance/payroll?month=2026-10 (FR-17, FR-18)
router.get('/payroll', financeController.getPayroll);

// GET & POST /api/v1/finance/parties (FR-19)
router.get('/parties', financeController.getParties);
router.post('/parties', authorize([ROLES.ADMIN, ROLES.DEPARTMENT_MANAGER]), financeController.createParty);

// GET & POST /api/v1/finance/transactions (FR-20, FR-21, FR-22)
router.get('/transactions', financeController.getTransactions);
router.post('/transactions', authorize([ROLES.ADMIN, ROLES.DEPARTMENT_MANAGER]), financeController.createTransaction);

module.exports = router;
