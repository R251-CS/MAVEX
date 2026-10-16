const safetyRepository = require('./safety.repository');
const { BadRequestError } = require('../../shared/errors');

async function listIncidents(month) {
  return await safetyRepository.getIncidents(month);
}

async function reportIncident(data) {
  const location = data.location || data.area;
  if (!data.title || !location) {
    throw new BadRequestError('عنوان الحادث/الملاحظة والموقع حقول إجبارية');
  }
  return await safetyRepository.createIncident({
    ...data,
    location,
    area: location,
    month: data.month || new Date().toISOString().slice(0, 7)
  });
}

module.exports = {
  listIncidents,
  reportIncident
};
