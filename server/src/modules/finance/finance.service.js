const financeRepository = require('./finance.repository');
const { BadRequestError } = require('../../shared/errors');

async function listPayroll(month) {
  return await financeRepository.getPayrollRecords(month);
}

async function listParties(type) {
  return await financeRepository.getParties(type);
}

async function addParty(data) {
  if (!data.name) {
    throw new BadRequestError('اسم العميل أو المورد مطلوب');
  }
  return await financeRepository.createParty(data);
}

async function listTransactions(partyId) {
  return await financeRepository.getTransactions(partyId);
}

async function recordTransaction(data) {
  if (!data.amount || Number(data.amount) <= 0) {
    throw new BadRequestError('المبلغ المالي يجب أن يكون رقماً موجباً');
  }
  if (!data.type || !['IN', 'OUT'].includes(data.type)) {
    throw new BadRequestError('نوع المعاملة يجب أن يكون وارد (IN) أو منصرف (OUT)');
  }
  return await financeRepository.createTransaction(data);
}

module.exports = {
  listPayroll,
  listParties,
  addParty,
  listTransactions,
  recordTransaction
};
