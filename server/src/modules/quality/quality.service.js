const qualityRepository = require('./quality.repository');
const { BadRequestError } = require('../../shared/errors');

async function listQualityEvents(month) {
  return await qualityRepository.getQualityEvents(month);
}

async function recordQualityEvent(data) {
  if (!data.title || !data.itemOrMachine) {
    throw new BadRequestError('العنصر أو الماكينة وتفاصيل الحدث حقول إجبارية');
  }
  return await qualityRepository.addQualityEvent({
    ...data,
    status: data.status || 'open',
    month: data.month || new Date().toISOString().slice(0, 7)
  });
}

module.exports = {
  listQualityEvents,
  recordQualityEvent
};
