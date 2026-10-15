const qualityService = require('./quality.service');

async function getQualityEvents(req, res, next) {
  try {
    const { month } = req.query;
    const events = await qualityService.listQualityEvents(month);
    res.status(200).json({
      status: 'success',
      data: { events }
    });
  } catch (err) {
    next(err);
  }
}

async function createQualityEvent(req, res, next) {
  try {
    const event = await qualityService.recordQualityEvent(req.body);
    res.status(201).json({
      status: 'success',
      data: { event }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getQualityEvents,
  createQualityEvent
};
