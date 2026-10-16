const { db } = require('../../config/firebase-admin');
const initialData = require('../../seeds/initial-data.json');

async function getOrders(status) {
  try {
    if (db) {
      let query = db.collection('productionOrders').orderBy('createdAt', 'desc');
      if (status) {
        query = query.where('status', '==', status);
      }
      const snapshot = await query.get();
      const orders = [];
      snapshot.forEach(doc => orders.push({ id: doc.id, ...doc.data() }));
      if (orders.length > 0) return orders;
    }
  } catch (err) {
    console.warn('Database getOrders fallback:', err.message);
  }

  if (status) {
    return (initialData.productionOrders || []).filter(o => o.status === status);
  }
  return initialData.productionOrders || [];
}

async function getProducts() {
  try {
    if (db) {
      const snapshot = await db.collection('products').get();
      const products = [];
      snapshot.forEach(doc => products.push({ id: doc.id, ...doc.data() }));
      if (products.length > 0) return products;
    }
  } catch (err) {
    console.warn('Database getProducts fallback:', err.message);
  }
  return initialData.products || [];
}

async function createOrder(data) {
  const stages = [
    { name: 'استلام الخامات', key: 'material_receipt', status: 'pending', completedAt: null, operator: data.operator || 'غير محدد' },
    { name: 'القطع بالليزر', key: 'laser', status: 'pending', completedAt: null, operator: 'فني الليزر' },
    { name: 'الثناية والتشكيل', key: 'bending', status: 'pending', completedAt: null, operator: 'فني الثناية' },
    { name: 'التشطيب والدهان', key: 'finishing_paint', status: 'pending', completedAt: null, operator: 'فني الدهان' }
  ];

  const newOrder = {
    id: `ord-${Date.now()}`,
    code: data.code || `WO-${Date.now().toString().slice(-4)}`,
    productName: data.productName,
    category: data.category || 'عام',
    rawMaterials: data.rawMaterials || 'خامات معيارية',
    stages: data.stages || stages,
    currentStage: 'material_receipt',
    status: 'in_progress',
    delayReason: data.delayReason || '',
    delayComment: data.delayComment || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (db) {
    const ref = await db.collection('productionOrders').add(newOrder);
    const doc = await ref.get();
    return { id: doc.id, ...doc.data() };
  }

  if (!initialData.productionOrders) initialData.productionOrders = [];
  initialData.productionOrders.unshift(newOrder);
  return newOrder;
}

async function updateStage(orderId, stageKey, stageData) {
  if (db) {
    const orderRef = db.collection('productionOrders').doc(orderId);
    return await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(orderRef);
      if (!doc.exists) throw new Error('أمر الإنتاج غير موجود');

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
        currentStage: stageData.status === 'completed' ? getNextStage(stageKey) : stageKey,
        delayReason: stageData.delayReason !== undefined ? stageData.delayReason : (order.delayReason || ''),
        delayComment: stageData.delayComment !== undefined ? stageData.delayComment : (order.delayComment || ''),
        updatedAt: new Date().toISOString()
      });

      return { id: orderId, stages: updatedStages };
    });
  }

  const order = (initialData.productionOrders || []).find(o => o.id === orderId);
  if (!order) throw new Error('أمر الإنتاج غير موجود');

  order.stages = order.stages.map(st => {
    if (st.key === stageKey) {
      return {
        ...st,
        ...stageData,
        completedAt: stageData.status === 'completed' ? new Date().toISOString() : st.completedAt
      };
    }
    return st;
  });

  if (stageData.delayReason !== undefined) order.delayReason = stageData.delayReason;
  if (stageData.delayComment !== undefined) order.delayComment = stageData.delayComment;
  if (stageData.status === 'completed') {
    order.currentStage = getNextStage(stageKey);
  }
  order.updatedAt = new Date().toISOString();

  return order;
}

function getNextStage(current) {
  const flow = ['material_receipt', 'laser', 'bending', 'finishing_paint'];
  const idx = flow.indexOf(current);
  if (idx >= 0 && idx < flow.length - 1) return flow[idx + 1];
  return 'finishing_paint';
}

module.exports = {
  getOrders,
  getProducts,
  createOrder,
  updateStage
};
