const employeesRepository = require('./employees.repository');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../../shared/errors');
const { ROLES, normalizeRole } = require('../../shared/constants');

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

async function removeEmployee(employeeId, currentUser = null) {
  if (!employeeId) {
    throw new BadRequestError('معرف الموظف مطلوب');
  }

  const employee = await employeesRepository.getEmployeeById(employeeId);
  if (!employee) {
    throw new NotFoundError('الموظف غير موجود');
  }

  if (currentUser) {
    const role = normalizeRole(currentUser.role);
    if (role !== ROLES.ADMIN && currentUser.departmentId && employee.departmentId !== currentUser.departmentId) {
      throw new ForbiddenError('غير مصرح لك بحذف موظف تابع لقسم آخر');
    }
  }

  return await employeesRepository.deleteEmployee(employeeId);
}

module.exports = {
  listDepartmentEmployeesWithMetrics,
  addEmployee,
  removeEmployee
};

