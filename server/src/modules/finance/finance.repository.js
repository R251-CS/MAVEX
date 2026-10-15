const { db } = require('../../config/firebase-admin');

async function getPayrollRecords(month) {
  let query = db.collection('payrollRecords');
  if (month) query = query.where('month', '==', month);
  const snapshot = await query.get();
  const payrolls = [];
  snapshot.forEach(doc => payrolls.push({ id: doc.id, ...doc.data() }));
  return payrolls;
}

async function getParties(type) {
  let query = db.collection('businessParties');
  if (type) query = query.where('type', '==', type);
  const snapshot = await query.get();
  const parties = [];
  snapshot.forEach(doc => parties.push({ id: doc.id, ...doc.data() }));
  return parties;
}

async function getTransactions(partyId) {
  let query = db.collection('financialTransactions').orderBy('createdAt', 'desc');
  if (partyId) query = query.where('partyId', '==', partyId);
  const snapshot = await query.get();
  const txs = [];
  snapshot.forEach(doc => txs.push({ id: doc.id, ...doc.data() }));
  return txs;
}

module.exports = {
  getPayrollRecords,
  getParties,
  getTransactions
};
