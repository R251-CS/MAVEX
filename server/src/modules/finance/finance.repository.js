const { db } = require('../../config/firebase-admin');
const initialData = require('../../seeds/initial-data.json');

async function getPayrollRecords(month) {
  try {
    if (db) {
      let query = db.collection('payrollRecords');
      if (month) query = query.where('month', '==', month);
      const snapshot = await query.get();
      const payrolls = [];
      snapshot.forEach(doc => payrolls.push({ id: doc.id, ...doc.data() }));
      if (payrolls.length > 0) return payrolls;
    }
  } catch (err) {
    console.warn('Database getPayrollRecords fallback:', err.message);
  }

  // Derive payroll breakdown from employees dataset (FR-17, FR-18)
  return (initialData.employees || []).map(emp => ({
    id: `pay-${emp.id}`,
    employeeId: emp.id,
    employeeName: emp.name,
    departmentId: emp.departmentId,
    title: emp.title,
    month: month || '2026-10',
    basicSalary: emp.basicSalary || 6000,
    incentives: emp.incentives || 1500,
    deductions: emp.deductions || 0,
    netSalary: emp.netSalary || ((emp.basicSalary || 6000) + (emp.incentives || 1500) - (emp.deductions || 0)),
    status: 'paid'
  }));
}

async function getParties(type) {
  try {
    if (db) {
      let query = db.collection('businessParties');
      if (type) query = query.where('type', '==', type);
      const snapshot = await query.get();
      const parties = [];
      snapshot.forEach(doc => parties.push({ id: doc.id, ...doc.data() }));
      if (parties.length > 0) return parties;
    }
  } catch (err) {
    console.warn('Database getParties fallback:', err.message);
  }

  if (type) {
    return (initialData.businessParties || []).filter(p => p.type === type);
  }
  return initialData.businessParties || [];
}

async function createParty(data) {
  const newParty = {
    id: `party-${Date.now()}`,
    name: data.name,
    type: data.type || 'customer',
    phone: data.phone || '',
    email: data.email || '',
    balance: Number(data.balance) || 0,
    commercialReg: data.commercialReg || '',
    status: 'active',
    createdAt: new Date().toISOString()
  };

  if (db) {
    const ref = await db.collection('businessParties').add(newParty);
    const doc = await ref.get();
    return { id: doc.id, ...doc.data() };
  }

  if (!initialData.businessParties) initialData.businessParties = [];
  initialData.businessParties.unshift(newParty);
  return newParty;
}

async function getTransactions(partyId) {
  try {
    if (db) {
      let query = db.collection('financialTransactions').orderBy('date', 'desc');
      if (partyId) query = query.where('partyId', '==', partyId);
      const snapshot = await query.get();
      const txs = [];
      snapshot.forEach(doc => txs.push({ id: doc.id, ...doc.data() }));
      if (txs.length > 0) return txs;
    }
  } catch (err) {
    console.warn('Database getTransactions fallback:', err.message);
  }

  if (partyId) {
    return (initialData.financialTransactions || []).filter(t => t.partyId === partyId);
  }
  return initialData.financialTransactions || [];
}

async function createTransaction(data) {
  const newTx = {
    id: `tx-${Date.now()}`,
    type: data.type === 'OUT' ? 'OUT' : 'IN',
    amount: Number(data.amount),
    category: data.category || (data.type === 'OUT' ? 'مصروفات تشغيل' : 'إيرادات وتحصيلات'),
    partyName: data.partyName || 'طرف عام',
    partyId: data.partyId || null,
    description: data.description || '',
    reference: data.reference || `REF-${Date.now().toString().slice(-4)}`,
    paymentMethod: data.paymentMethod || 'تحويل بنكي',
    date: data.date || new Date().toISOString().slice(0, 10),
    createdAt: new Date().toISOString()
  };

  if (db) {
    const ref = await db.collection('financialTransactions').add(newTx);
    const doc = await ref.get();
    return { id: doc.id, ...doc.data() };
  }

  if (!initialData.financialTransactions) initialData.financialTransactions = [];
  initialData.financialTransactions.unshift(newTx);

  // Update business party balance if linked
  if (data.partyId) {
    const party = (initialData.businessParties || []).find(p => p.id === data.partyId);
    if (party) {
      if (data.type === 'IN') {
        party.balance = (party.balance || 0) + Number(data.amount);
      } else {
        party.balance = (party.balance || 0) - Number(data.amount);
      }
    }
  }

  return newTx;
}

module.exports = {
  getPayrollRecords,
  getParties,
  createParty,
  getTransactions,
  createTransaction
};
