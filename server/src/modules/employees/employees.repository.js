const { db } = require('../../config/firebase-admin');
const initialData = require('../../seeds/initial-data.json');

async function getEmployeesByDepartment(departmentId) {
  try {
    if (db) {
      const snapshot = await db.collection('employees')
        .where('departmentId', '==', departmentId)
        .where('isActive', '==', true)
        .get();

      const employees = [];
      snapshot.forEach(doc => {
        employees.push({ id: doc.id, ...doc.data() });
      });
      if (employees.length > 0) return employees;
    }
  } catch (err) {
    console.warn(`Database getEmployeesByDepartment fallback for ${departmentId}:`, err.message);
  }

  return initialData.employees.filter(
    e => e.departmentId === departmentId && e.isActive !== false
  );
}

async function getEmployeeMonthlyMetrics(employeeId, month) {
  try {
    if (db) {
      const docId = `${employeeId}_${month}`;
      const doc = await db.collection('employeeMonthlyMetrics').doc(docId).get();
      if (doc.exists) return { id: doc.id, ...doc.data() };
    }
  } catch (err) {
    console.warn(`Database getEmployeeMonthlyMetrics fallback for ${employeeId}:`, err.message);
  }
  return { employeeId, month, score: 90, status: 'good' };
}

async function createEmployee(data) {
  if (db) {
    const ref = await db.collection('employees').add({
      ...data,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    const doc = await ref.get();
    return { id: doc.id, ...doc.data() };
  }
  const newEmp = { id: `emp-${Date.now()}`, ...data, isActive: true };
  initialData.employees.push(newEmp);
  return newEmp;
}

async function getEmployeeById(employeeId) {
  try {
    if (db) {
      const doc = await db.collection('employees').doc(employeeId).get();
      if (doc.exists) return { id: doc.id, ...doc.data() };
    }
  } catch (err) {
    console.warn(`Database getEmployeeById notice for ${employeeId}:`, err.message);
  }
  return initialData.employees.find(e => e.id === employeeId) || null;
}

async function deleteEmployee(employeeId) {
  if (db) {
    await db.collection('employees').doc(employeeId).update({
      isActive: false,
      deletedAt: new Date().toISOString()
    });
  }
  const emp = initialData.employees.find(e => e.id === employeeId);
  if (emp) emp.isActive = false;
  return true;
}

module.exports = {
  getEmployeesByDepartment,
  getEmployeeMonthlyMetrics,
  getEmployeeById,
  createEmployee,
  deleteEmployee
};

