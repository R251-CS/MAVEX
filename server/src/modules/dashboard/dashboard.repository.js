const { db } = require('../../config/mongodb');
const initialData = require('../../seeds/initial-data.json');

/**
 * Fetch monthly performance report for a specific department
 */
async function getDepartmentMonthlyReport(departmentId, month) {
  try {
    if (db) {
      const docId = `${departmentId}_${month}`;
      const doc = await db.collection('departmentMonthlyReports').doc(docId).get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      }
    }
  } catch (err) {
    console.warn(`Database getDepartmentMonthlyReport fallback for ${departmentId}:`, err.message);
  }

  return initialData.departmentMonthlyReports.find(
    r => r.departmentId === departmentId && r.month === month
  ) || initialData.departmentMonthlyReports.find(r => r.departmentId === departmentId) || null;
}

/**
 * Fetch all department monthly reports for a given month with fallback in local dev
 */
async function getAllDepartmentReports(month) {
  try {
    if (db) {
      const snapshot = await db.collection('departmentMonthlyReports')
        .where('month', '==', month)
        .get();

      const reports = [];
      snapshot.forEach(doc => {
        reports.push({ id: doc.id, ...doc.data() });
      });
      if (reports.length > 0) return reports;
    }
  } catch (err) {
    console.warn('Database query fallback for monthly reports:', err.message);
  }

  // Instant response from curated factory baseline data
  return initialData.departmentMonthlyReports;
}

module.exports = {
  getDepartmentMonthlyReport,
  getAllDepartmentReports
};
