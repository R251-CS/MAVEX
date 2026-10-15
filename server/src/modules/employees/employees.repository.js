const { db } = require('../../config/firebase-admin');

async function getEmployeesByDepartment(departmentId) {
  const snapshot = await db.collection('employees')
    .where('departmentId', '==', departmentId)
    .where('isActive', '==', true)
    .get();

  const employees = [];
  snapshot.forEach(doc => {
    employees.push({ id: doc.id, ...doc.data() });
  });
  return employees;
}

async function getEmployeeMonthlyMetrics(employeeId, month) {
  const docId = `${employeeId}_${month}`;
  const doc = await db.collection('employeeMonthlyMetrics').doc(docId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function createEmployee(data) {
  const ref = await db.collection('employees').add({
    ...data,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  const doc = await ref.get();
  return { id: doc.id, ...doc.data() };
}

async function deleteEmployee(employeeId) {
  // Soft delete to preserve historical integrity
  await db.collection('employees').doc(employeeId).update({
    isActive: false,
    deletedAt: new Date().toISOString()
  });
  return true;
}

module.exports = {
  getEmployeesByDepartment,
  getEmployeeMonthlyMetrics,
  createEmployee,
  deleteEmployee
};
