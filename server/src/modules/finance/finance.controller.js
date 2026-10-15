const financeService = require('./finance.service');

async function getPayroll(req, res, next) {
  try {
    const { month } = req.query;
    const records = await financeService.listPayroll(month);
    res.status(200).json({ status: 'success', data: { payroll: records } });
  } catch (err) {
    next(err);
  }
}

async function getParties(req, res, next) {
  try {
    const { type } = req.query;
    const parties = await financeService.listParties(type);
    res.status(200).json({ status: 'success', data: { parties } });
  } catch (err) {
    next(err);
  }
}

async function getTransactions(req, res, next) {
  try {
    const { partyId } = req.query;
    const transactions = await financeService.listTransactions(partyId);
    res.status(200).json({ status: 'success', data: { transactions } });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getPayroll,
  getParties,
  getTransactions
};
