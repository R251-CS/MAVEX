const { db } = require('../../config/firebase-admin');

async function getQualityEvents(month) {
  let query = db.collection('qualityEvents').orderBy('date', 'desc');
  if (month) {
    query = query.where('month', '==', month);
  }
  const snapshot = await query.get();
  const events = [];
  snapshot.forEach(doc => {
    events.push({ id: doc.id, ...doc.data() });
  });
  return events;
}

async function addQualityEvent(data) {
  const ref = await db.collection('qualityEvents').add({
    ...data,
    createdAt: new Date().toISOString()
  });
  const doc = await ref.get();
  return { id: doc.id, ...doc.data() };
}

module.exports = {
  getQualityEvents,
  addQualityEvent
};
