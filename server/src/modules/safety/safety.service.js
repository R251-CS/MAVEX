const safetyRepository = require('./safety.repository');
const { BadRequestError } = require('../../shared/errors');

async function listIncidents(month) {
  return await safetyRepository.getIncidents(month);
}

async function reportIncident(data) {
  if (!data.title || !data.location) {
    throw new BadRequestError('عنوان الحادث/الملاحظة والموقع حقول إجبارية');
  }
  return await safetyRepository.createIncident({
    ...data,
    month: data.month || new Date().toISOString().slice(0, 7)
  });
}

module.exports = {
  listIncidents,
  reportIncident
};
