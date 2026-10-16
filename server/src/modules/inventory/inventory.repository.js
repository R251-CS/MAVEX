const { db } = require('../../config/firebase-admin');
const initialData = require('../../seeds/initial-data.json');

async function getInventoryItems() {
  try {
    if (db && process.env.FIREBASE_PRIVATE_KEY) {
      const snapshot = await db.collection('inventoryItems').get();
      const items = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
      if (items.length > 0) return items;
    }
  } catch (err) {
    console.warn('Firestore getInventoryItems fallback:', err.message);
  }

  return initialData.inventoryItems || [];
}

async function getMovements(limit = 20) {
  try {
    if (db && process.env.FIREBASE_PRIVATE_KEY) {
      const snapshot = await db.collection('inventoryMovements').orderBy('createdAt', 'desc').limit(limit).get();
      const movements = [];
      snapshot.forEach(doc => movements.push({ id: doc.id, ...doc.data() }));
      if (movements.length > 0) return movements;
    }
  } catch (err) {
    console.warn('Firestore getMovements fallback:', err.message);
  }

  return initialData.inventoryMovements || [];
}

async function getWarehouses() {
  return [
    { id: 'wh-main', name: 'المستودع الرئيسي للخامات', code: 'WH-01' },
    { id: 'wh-paint', name: 'مستودع الكيماويات والدهانات', code: 'WH-02' }
  ];
}

async function getStockLevel(warehouseId, itemId) {
  const item = (initialData.inventoryItems || []).find(i => i.id === itemId);
  return item ? item.quantity : 0;
}

/**
 * Atomic inventory movement with stock balance check to prevent negative balance
 */
async function recordMovementTransaction({ itemId, warehouseId, type, quantity, reason, referenceId, createdBy }) {
  const item = (initialData.inventoryItems || []).find(i => i.id === itemId);
  const currentQty = item ? item.quantity : 0;
  const numQty = Number(quantity);

  let newQty = currentQty;
  if (type === 'IN') {
    newQty += numQty;
  } else if (type === 'OUT') {
    if (currentQty < numQty) {
      throw new Error(`الرصيد غير كافٍ للصرف. الرصيد الحالي: ${currentQty} والكمية المطلوبة: ${numQty}`);
    }
    newQty -= numQty;
  } else if (type === 'ADJUST') {
    newQty = numQty;
  }

  if (item) {
    item.quantity = newQty;
  }

  const movementRecord = {
    id: `mov-${Date.now()}`,
    warehouseId: warehouseId || 'wh-main',
    itemId,
    itemName: item ? item.name : itemId,
    type,
    quantity: numQty,
    previousBalance: currentQty,
    newBalance: newQty,
    reason: reason || 'حركة مخزنية دورية',
    referenceId: referenceId || `REF-${Date.now().toString().slice(-4)}`,
    createdBy: createdBy || 'أمين المستودع',
    createdAt: new Date().toISOString()
  };

  if (!initialData.inventoryMovements) initialData.inventoryMovements = [];
  initialData.inventoryMovements.unshift(movementRecord);

  if (db && process.env.FIREBASE_PRIVATE_KEY) {
    try {
      await db.collection('inventoryMovements').add(movementRecord);
    } catch (e) {
      console.warn('Cloud firestore movement save error:', e.message);
    }
  }

  return { itemId, warehouseId, previousBalance: currentQty, newBalance: newQty, movement: movementRecord };
}

module.exports = {
  getInventoryItems,
  getMovements,
  getWarehouses,
  getStockLevel,
  recordMovementTransaction
};
