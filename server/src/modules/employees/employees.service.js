const employeesRepository = require('./employees.repository');
const { BadRequestError } = require('../../shared/errors');

async function listDepartmentEmployeesWithMetrics(departmentId, month) {
  if (!departmentId) {
    throw new BadRequestError('معرف القسم مطلوب');
  }

  const employees = await employeesRepository.getEmployeesByDepartment(departmentId);

  // If month is provided, attach employee monthly metrics
  if (month) {
    const listWithMetrics = await Promise.all(
      employees.map(async (emp) => {
        const metrics = await employeesRepository.getEmployeeMonthlyMetrics(emp.id, month);
        return {
          ...emp,
          metrics: metrics || {
            errorsCount: 0,
            assignedMachines: [],
            performanceScore: 100,
            notes: ''
          }
        };
      })
    );
    return listWithMetrics;
  }

  return employees;
}

async function addEmployee(data) {
  if (!data.name || !data.departmentId) {
    throw new BadRequestError('اسم الموظف والقسم حقول إجبارية');
  }
  return await employeesRepository.createEmployee(data);
}

async function removeEmployee(employeeId) {
  if (!employeeId) {
    throw new BadRequestError('معرف الموظف مطلوب');
  }
  return await employeesRepository.deleteEmployee(employeeId);
}

module.exports = {
  listDepartmentEmployeesWithMetrics,
  addEmployee,
  removeEmployee
};
