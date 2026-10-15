const { db } = require('../../config/firebase-admin');

async function getIncidents(month) {
  let query = db.collection('safetyIncidents').orderBy('date', 'desc');
  if (month) query = query.where('month', '==', month);
  const snapshot = await query.get();
  const incidents = [];
  snapshot.forEach(doc => incidents.push({ id: doc.id, ...doc.data() }));
  return incidents;
}

async function createIncident(data) {
  const ref = await db.collection('safetyIncidents').add({
    ...data,
    status: data.status || 'investigating',
    createdAt: new Date().toISOString()
  });
  const doc = await ref.get();
  return { id: doc.id, ...doc.data() };
}

module.exports = {
  getIncidents,
  createIncident
};
