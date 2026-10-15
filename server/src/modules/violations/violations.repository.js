const { db } = require('../../config/firebase-admin');

async function getViolations(month) {
  let query = db.collection('violations').orderBy('date', 'desc');
  if (month) query = query.where('month', '==', month);
  const snapshot = await query.get();
  const violations = [];
  snapshot.forEach(doc => violations.push({ id: doc.id, ...doc.data() }));
  return violations;
}

async function createViolation(data) {
  const ref = await db.collection('violations').add({
    ...data,
    status: data.status || 'pending_review',
    createdAt: new Date().toISOString()
  });
  const doc = await ref.get();
  return { id: doc.id, ...doc.data() };
}

module.exports = {
  getViolations,
  createViolation
};
