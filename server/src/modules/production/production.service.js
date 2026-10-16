const productionRepository = require('./production.repository');
const { BadRequestError } = require('../../shared/errors');

async function listOrders(status) {
  return await productionRepository.getOrders(status);
}

async function listProducts() {
  return await productionRepository.getProducts();
}

async function startNewOrder(data) {
  if (!data.productName) {
    throw new BadRequestError('اسم المنتج حقل إجباري');
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
  listProducts,
  startNewOrder,
  advanceStage
};
