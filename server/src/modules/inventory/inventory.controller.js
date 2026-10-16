const inventoryService = require('./inventory.service');

async function getItems(req, res, next) {
  try {
    const items = await inventoryService.listItems();
    res.status(200).json({ status: 'success', data: { items } });
  } catch (err) {
    next(err);
  }
}

async function getMovements(req, res, next) {
  try {
    const movements = await inventoryService.listMovements();
    res.status(200).json({ status: 'success', data: { movements } });
  } catch (err) {
    next(err);
  }
}

async function getWarehouses(req, res, next) {
  try {
    const warehouses = await inventoryService.listWarehouses();
    res.status(200).json({ status: 'success', data: { warehouses } });
  } catch (err) {
    next(err);
  }
}

async function createMovement(req, res, next) {
  try {
    const movement = await inventoryService.addMovement({
      ...req.body,
      createdBy: req.user ? req.user.name || req.user.email : 'أمين المستودع'
    });
    res.status(201).json({ status: 'success', data: { movement } });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getItems,
  getMovements,
  getWarehouses,
  createMovement
};
