const { db } = require('../../config/firebase-admin');

async function getInventoryItems() {
  const snapshot = await db.collection('inventoryItems').get();
  const items = [];
  snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
  return items;
}

async function getWarehouses() {
  const snapshot = await db.collection('warehouses').get();
  const warehouses = [];
  snapshot.forEach(doc => warehouses.push({ id: doc.id, ...doc.data() }));
  return warehouses;
}

async function getStockLevel(warehouseId, itemId) {
  const docId = `${warehouseId}_${itemId}`;
  const doc = await db.collection('warehouseStock').doc(docId).get();
  if (!doc.exists) return 0;
  return doc.data().quantity || 0;
}

/**
 * Atomic inventory movement with stock balance check to prevent negative balance
 */
async function recordMovementTransaction({ itemId, warehouseId, type, quantity, reason, referenceId, createdBy }) {
  const stockRef = db.collection('warehouseStock').doc(`${warehouseId}_${itemId}`);
  const movementRef = db.collection('inventoryMovements').doc();

  return await db.runTransaction(async (transaction) => {
    const stockDoc = await transaction.get(stockRef);
    const currentQty = stockDoc.exists ? (stockDoc.data().quantity || 0) : 0;

    let newQty = currentQty;
    if (type === 'IN') {
      newQty += quantity;
    } else if (type === 'OUT') {
      if (currentQty < quantity) {
        throw new Error(`الرصيد غير كافٍ للصرف. الرصيد الحالي: ${currentQty} والكمية المطلوبة: ${quantity}`);
      }
      newQty -= quantity;
    } else if (type === 'ADJUST') {
      newQty = quantity;
    }

    transaction.set(stockRef, {
      warehouseId,
      itemId,
      quantity: newQty,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    transaction.set(movementRef, {
      warehouseId,
      itemId,
      type,
      quantity,
      previousBalance: currentQty,
      newBalance: newQty,
      reason: reason || '',
      referenceId: referenceId || null,
      createdBy: createdBy || null,
      createdAt: new Date().toISOString()
    });

    return { itemId, warehouseId, previousBalance: currentQty, newBalance: newQty };
  });
}

module.exports = {
  getInventoryItems,
  getWarehouses,
  getStockLevel,
  recordMovementTransaction
};
