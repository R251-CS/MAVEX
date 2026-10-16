const { db, isDbConfigured } = require('../../config/mongodb');
const initialData = require('../../seeds/initial-data.json');

async function getViolations(month) {
  try {
    if (isDbConfigured && db) {
      let query = db.collection('violations').orderBy('date', 'desc');
      if (month) query = query.where('month', '==', month);
      const snapshot = await query.get();
      const violations = [];
      snapshot.forEach(doc => violations.push({ id: doc.id, ...doc.data() }));
      if (violations.length > 0) return violations;
    }
  } catch (err) {
    console.warn('Firestore getViolations notice:', err.message);
  }

  const list = initialData.violations || [];
  if (month) {
    return list.filter(v => v.month === month);
  }
  return list;
}

async function createViolation(data) {
  if (isDbConfigured && db) {
    const ref = await db.collection('violations').add({
      ...data,
      status: data.status || 'pending_review',
      createdAt: new Date().toISOString()
    });
    const doc = await ref.get();
    return { id: doc.id, ...doc.data() };
  }

  const newViolation = {
    id: `v-${Date.now()}`,
    ...data,
    status: data.status || 'pending_review',
    createdAt: new Date().toISOString()
  };
  if (!initialData.violations) initialData.violations = [];
  initialData.violations.unshift(newViolation);
  return newViolation;
}

async function updateViolation(id, data) {
  if (isDbConfigured && db) {
    await db.collection('violations').doc(id).set({
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    const doc = await db.collection('violations').doc(id).get();
    return { id: doc.id, ...doc.data() };
  }

  const v = (initialData.violations || []).find(item => item.id === id);
  if (v) {
    Object.assign(v, data, { updatedAt: new Date().toISOString() });
    return v;
  }
  return null;
}

module.exports = {
  getViolations,
  createViolation,
  updateViolation
};


