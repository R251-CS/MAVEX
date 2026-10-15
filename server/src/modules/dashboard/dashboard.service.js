const dashboardRepository = require('./dashboard.repository');
const { DEPARTMENTS, DEPARTMENT_NAMES_AR } = require('../../shared/constants');

/**
 * Service to aggregate dashboard metrics for the given month
 */
async function getDashboardOverview(month) {
  // Validate month format YYYY-MM
  if (!month || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    throw new Error('صيغة الشهر غير صالحة، الصيغة المطلوبة YYYY-MM');
  }

  const reports = await dashboardRepository.getAllDepartmentReports(month);
  const reportsByDept = {};
  reports.forEach(r => {
    reportsByDept[r.departmentId] = r;
  });

  // Build metrics for all 7 departments, with sensible defaults if report not seeded yet
  const departmentSummaries = Object.values(DEPARTMENTS).map(deptId => {
    const report = reportsByDept[deptId];
    return {
      departmentId: deptId,
      name: DEPARTMENT_NAMES_AR[deptId] || deptId,
      managerName: report?.managerName || 'غير محدد',
      performancePercentage: typeof report?.performancePercentage === 'number' ? report.performancePercentage : 0,
      kpis: report?.kpis || {},
      status: report?.status || 'normal',
      updatedAt: report?.updatedAt || null
    };
  });

  // Calculate overall performance average
  const total = departmentSummaries.reduce((acc, curr) => acc + curr.performancePercentage, 0);
  const averagePerformance = departmentSummaries.length > 0 
    ? Math.round(total / departmentSummaries.length) 
    : 0;

  return {
    month,
    overallPerformance: averagePerformance,
    departmentsCount: departmentSummaries.length,
    departments: departmentSummaries
  };
}

module.exports = {
  getDashboardOverview
};
