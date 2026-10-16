const { db, isDbConfigured } = require('../../config/firebase-admin');
const initialData = require('../../seeds/initial-data.json');

async function getIncidents(month) {
  try {
    if (isDbConfigured && db) {
      let query = db.collection('safetyIncidents').orderBy('date', 'desc');
      if (month) query = query.where('month', '==', month);
      const snapshot = await query.get();
      const incidents = [];
      snapshot.forEach(doc => incidents.push({ id: doc.id, ...doc.data() }));
      if (incidents.length > 0) return incidents;
    }
  } catch (err) {
    console.warn('Firestore getIncidents notice:', err.message);
  }

  const list = initialData.safetyIncidents || [];
  if (month) {
    return list.filter(i => i.month === month);
  }
  return list;
}

async function createIncident(data) {
  if (isDbConfigured && db) {
    const ref = await db.collection('safetyIncidents').add({
      ...data,
      status: data.status || 'investigating',
      createdAt: new Date().toISOString()
    });
    const doc = await ref.get();
    return { id: doc.id, ...doc.data() };
  }

  const newIncident = {
    id: `inc-${Date.now()}`,
    ...data,
    status: data.status || 'investigating',
    createdAt: new Date().toISOString()
  };
  if (!initialData.safetyIncidents) initialData.safetyIncidents = [];
  initialData.safetyIncidents.unshift(newIncident);
  return newIncident;
}

module.exports = {
  getIncidents,
  createIncident
};

