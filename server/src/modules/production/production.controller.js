const productionService = require('./production.service');

async function getOrders(req, res, next) {
  try {
    const { status } = req.query;
    const orders = await productionService.listOrders(status);
    res.status(200).json({ status: 'success', data: { orders } });
  } catch (err) {
    next(err);
  }
}

async function createOrder(req, res, next) {
  try {
    const order = await productionService.startNewOrder(req.body);
    res.status(201).json({ status: 'success', data: { order } });
  } catch (err) {
    next(err);
  }
}

async function updateStage(req, res, next) {
  try {
    const { id, stageKey } = req.params;
    const updated = await productionService.advanceStage(id, stageKey, req.body);
    res.status(200).json({ status: 'success', data: { order: updated } });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getOrders,
  createOrder,
  updateStage
};
