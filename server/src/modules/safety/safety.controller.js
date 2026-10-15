const safetyService = require('./safety.service');

async function getIncidents(req, res, next) {
  try {
    const { month } = req.query;
    const incidents = await safetyService.listIncidents(month);
    res.status(200).json({ status: 'success', data: { incidents } });
  } catch (err) {
    next(err);
  }
}

async function createIncident(req, res, next) {
  try {
    const incident = await safetyService.reportIncident({
      ...req.body,
      reportedBy: req.user.uid
    });
    res.status(201).json({ status: 'success', data: { incident } });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getIncidents,
  createIncident
};
