const { db } = require('../../config/firebase-admin');
const initialData = require('../../seeds/initial-data.json');

async function getQualityEvents(month) {
  try {
    if (db && process.env.FIREBASE_PRIVATE_KEY) {
      let query = db.collection('qualityEvents').orderBy('date', 'desc');
      if (month) {
        query = query.where('month', '==', month);
      }
      const snapshot = await query.get();
      const events = [];
      snapshot.forEach(doc => {
        events.push({ id: doc.id, ...doc.data() });
      });
      if (events.length > 0) return events;
    }
  } catch (err) {
    console.warn('Firestore getQualityEvents fallback:', err.message);
  }

  if (month) {
    return (initialData.qualityEvents || []).filter(e => e.month === month);
  }
  return initialData.qualityEvents || [];
}

async function addQualityEvent(data) {
  if (db && process.env.FIREBASE_PRIVATE_KEY) {
    const ref = await db.collection('qualityEvents').add({
      ...data,
      createdAt: new Date().toISOString()
    });
    const doc = await ref.get();
    return { id: doc.id, ...doc.data() };
  }

  const newEvent = {
    id: `qe-${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString()
  };
  if (!initialData.qualityEvents) initialData.qualityEvents = [];
  initialData.qualityEvents.unshift(newEvent);
  return newEvent;
}

module.exports = {
  getQualityEvents,
  addQualityEvent
};
