const maintenanceRepository = require('./maintenance.repository');
const { BadRequestError } = require('../../shared/errors');

async function listTickets(departmentId, status) {
  return await maintenanceRepository.getTickets(departmentId, status);
}

async function reportTicket(data) {
  if (!data.machineId && !data.title) {
    throw new BadRequestError('عنوان البلاغ أو الماكينة حقل إجباري');
  }
  return await maintenanceRepository.createTicket(data);
}

async function resolveTicket(id, status, notes) {
  if (!id || !status) {
    throw new BadRequestError('معرف البلاغ والحالة حقول إجبارية');
  }
  return await maintenanceRepository.updateTicketStatus(id, status, notes);
}

module.exports = {
  listTickets,
  reportTicket,
  resolveTicket
};
