const { db } = require('../../config/firebase-admin');
const initialData = require('../../seeds/initial-data.json');

async function getEmployeesByDepartment(departmentId) {
  try {
    if (db && process.env.FIREBASE_PRIVATE_KEY) {
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
    console.warn(`Firestore getEmployeesByDepartment fallback for ${departmentId}:`, err.message);
  }

  return initialData.employees.filter(
    e => e.departmentId === departmentId && e.isActive !== false
  );
}

async function getEmployeeMonthlyMetrics(employeeId, month) {
  try {
    if (db && process.env.FIREBASE_PRIVATE_KEY) {
      const docId = `${employeeId}_${month}`;
      const doc = await db.collection('employeeMonthlyMetrics').doc(docId).get();
      if (doc.exists) return { id: doc.id, ...doc.data() };
    }
  } catch (err) {
    console.warn(`Firestore getEmployeeMonthlyMetrics fallback for ${employeeId}:`, err.message);
  }
  return { employeeId, month, score: 90, status: 'good' };
}

async function createEmployee(data) {
  if (db && process.env.FIREBASE_PRIVATE_KEY) {
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

async function deleteEmployee(employeeId) {
  if (db && process.env.FIREBASE_PRIVATE_KEY) {
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
  createEmployee,
  deleteEmployee
};
