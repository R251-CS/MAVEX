const violationsService = require('./violations.service');

async function getViolations(req, res, next) {
  try {
    const { month } = req.query;
    const violations = await violationsService.listViolations(month);
    res.status(200).json({ status: 'success', data: { violations } });
  } catch (err) {
    next(err);
  }
}

async function createViolation(req, res, next) {
  try {
    const violation = await violationsService.recordViolation({
      ...req.body,
      recordedBy: req.user.uid
    });
    res.status(201).json({ status: 'success', data: { violation } });
  } catch (err) {
    next(err);
  }
}

async function updateViolation(req, res, next) {
  try {
    const { id } = req.params;
    const violation = await violationsService.modifyViolation(id, req.body);
    res.status(200).json({ status: 'success', data: { violation } });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getViolations,
  createViolation,
  updateViolation
};

