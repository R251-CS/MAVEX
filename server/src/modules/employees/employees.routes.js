const express = require('express');
const router = express.Router();
const employeesController = require('./employees.controller');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const { ROLES } = require('../../shared/constants');

router.use(authenticate);

// GET /api/v1/employees?departmentId=technical_office&month=2026-10
router.get('/', employeesController.getEmployees);

// POST /api/v1/employees
router.post('/', authorize([ROLES.ADMIN, ROLES.DEPARTMENT_MANAGER], { checkDepartment: true }), employeesController.createEmployee);

// DELETE /api/v1/employees/:id
router.delete('/:id', authorize([ROLES.ADMIN, ROLES.DEPARTMENT_MANAGER]), employeesController.deleteEmployee);

module.exports = router;
