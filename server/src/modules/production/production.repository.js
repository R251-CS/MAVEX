const { db } = require('../../config/firebase-admin');

async function getOrders(status) {
  let query = db.collection('productionOrders').orderBy('createdAt', 'desc');
  if (status) {
    query = query.where('status', '==', status);
  }
  const snapshot = await query.get();
  const orders = [];
  snapshot.forEach(doc => orders.push({ id: doc.id, ...doc.data() }));
  return orders;
}

async function createOrder(data) {
  // Standard stages based on factory discovery: [material_receipt, laser, bending, finishing_paint]
  const stages = [
    { name: 'استلام الخامات', key: 'material_receipt', status: 'pending', completedAt: null },
    { name: 'الليزر', key: 'laser', status: 'pending', completedAt: null },
    { name: 'الثناية', key: 'bending', status: 'pending', completedAt: null },
    { name: 'التشطيب والدهان', key: 'finishing_paint', status: 'pending', completedAt: null }
  ];

  const ref = await db.collection('productionOrders').add({
    ...data,
    stages: data.stages || stages,
    currentStage: 'material_receipt',
    status: 'in_progress',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  const doc = await ref.get();
  return { id: doc.id, ...doc.data() };
}

async function updateStage(orderId, stageKey, stageData) {
  const orderRef = db.collection('productionOrders').doc(orderId);
  return await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(orderRef);
    if (!doc.exists) {
      throw new Error('أمر الإنتاج غير موجود');
    }

    const order = doc.data();
    const updatedStages = order.stages.map(st => {
      if (st.key === stageKey) {
        return {
          ...st,
          ...stageData,
          completedAt: stageData.status === 'completed' ? new Date().toISOString() : st.completedAt
        };
      }
      return st;
    });

    transaction.update(orderRef, {
      stages: updatedStages,
      updatedAt: new Date().toISOString()
    });

    return { id: orderId, stages: updatedStages };
  });
}

module.exports = {
  getOrders,
  createOrder,
  updateStage
};
