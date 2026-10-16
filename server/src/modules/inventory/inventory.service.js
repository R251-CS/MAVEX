const inventoryRepository = require('./inventory.repository');
const { BadRequestError } = require('../../shared/errors');

async function listItems() {
  return await inventoryRepository.getInventoryItems();
}

async function listMovements() {
  return await inventoryRepository.getMovements();
}

async function listWarehouses() {
  return await inventoryRepository.getWarehouses();
}

async function addMovement(data) {
  const { itemId, type, quantity } = data;
  if (!itemId || !type || !quantity) {
    throw new BadRequestError('الصنف، نوع الحركة، والكمية حقول إجبارية');
  }

  if (quantity <= 0) {
    throw new BadRequestError('الكمية يجب أن تكون أكبر من صفر');
  }

  if (!['IN', 'OUT', 'ADJUST'].includes(type)) {
    throw new BadRequestError('نوع الحركة غير صالح. الأنواع المتاحة: IN, OUT, ADJUST');
  }

  return await inventoryRepository.recordMovementTransaction(data);
}

module.exports = {
  listItems,
  listMovements,
  listWarehouses,
  addMovement
};
