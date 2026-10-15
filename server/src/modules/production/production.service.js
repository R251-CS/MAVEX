const productionRepository = require('./production.repository');
const { BadRequestError } = require('../../shared/errors');

async function listOrders(status) {
  return await productionRepository.getOrders(status);
}

async function startNewOrder(data) {
  if (!data.orderNumber || !data.productName || !data.quantity) {
    throw new BadRequestError('رقم أمر الإنتاج، اسم المنتج، والكمية حقول إجبارية');
  }
  return await productionRepository.createOrder(data);
}

async function advanceStage(orderId, stageKey, stageData) {
  if (!orderId || !stageKey) {
    throw new BadRequestError('معرف أمر الإنتاج والمرحلة حقول إجبارية');
  }
  return await productionRepository.updateStage(orderId, stageKey, stageData);
}

module.exports = {
  listOrders,
  startNewOrder,
  advanceStage
};
