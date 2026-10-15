const employeesService = require('./employees.service');

async function getEmployees(req, res, next) {
  try {
    const { departmentId, month } = req.query;
    const employees = await employeesService.listDepartmentEmployeesWithMetrics(departmentId, month);
    res.status(200).json({
      status: 'success',
      data: { employees }
    });
  } catch (err) {
    next(err);
  }
}

async function createEmployee(req, res, next) {
  try {
    const newEmployee = await employeesService.addEmployee(req.body);
    res.status(201).json({
      status: 'success',
      data: { employee: newEmployee }
    });
  } catch (err) {
    next(err);
  }
}

async function deleteEmployee(req, res, next) {
  try {
    const { id } = req.params;
    await employeesService.removeEmployee(id);
    res.status(200).json({
      status: 'success',
      message: 'تم حذف الموظف بنجاح'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getEmployees,
  createEmployee,
  deleteEmployee
};
