const maintenanceService = require('./maintenance.service');

async function getTickets(req, res, next) {
  try {
    const { departmentId, status } = req.query;
    const tickets = await maintenanceService.listTickets(departmentId, status);
    res.status(200).json({ status: 'success', data: { tickets } });
  } catch (err) {
    next(err);
  }
}

async function createTicket(req, res, next) {
  try {
    const ticket = await maintenanceService.reportTicket({
      ...req.body,
      reportedBy: req.user.uid
    });
    res.status(201).json({ status: 'success', data: { ticket } });
  } catch (err) {
    next(err);
  }
}

async function updateTicketStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    await maintenanceService.resolveTicket(id, status, notes);
    res.status(200).json({ status: 'success', message: 'تم تحديث حالة البلاغ بنجاح' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getTickets,
  createTicket,
  updateTicketStatus
};
