const financeRepository = require('./finance.repository');

async function listPayroll(month) {
  return await financeRepository.getPayrollRecords(month);
}

async function listParties(type) {
  return await financeRepository.getParties(type);
}

async function listTransactions(partyId) {
  return await financeRepository.getTransactions(partyId);
}

module.exports = {
  listPayroll,
  listParties,
  listTransactions
};
