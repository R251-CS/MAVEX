const { db } = require('../../config/firebase-admin');

async function getTickets(departmentId, status) {
  let query = db.collection('maintenanceTickets').orderBy('createdAt', 'desc');
  if (departmentId) query = query.where('departmentId', '==', departmentId);
  if (status) query = query.where('status', '==', status);

  const snapshot = await query.get();
  const tickets = [];
  snapshot.forEach(doc => tickets.push({ id: doc.id, ...doc.data() }));
  return tickets;
}

async function createTicket(data) {
  const ref = await db.collection('maintenanceTickets').add({
    ...data,
    status: 'open',
    createdAt: new Date().toISOString()
  });
  const doc = await ref.get();
  return { id: doc.id, ...doc.data() };
}

async function updateTicketStatus(id, status, notes) {
  await db.collection('maintenanceTickets').doc(id).update({
    status,
    resolutionNotes: notes || '',
    updatedAt: new Date().toISOString()
  });
  return true;
}

module.exports = {
  getTickets,
  createTicket,
  updateTicketStatus
};
