const violationsRepository = require('./violations.repository');
const { BadRequestError } = require('../../shared/errors');

async function listViolations(month) {
  return await violationsRepository.getViolations(month);
}

async function recordViolation(data) {
  if (!data.title || !data.departmentId) {
    throw new BadRequestError('عنوان المخالفة والقسم المعني حقول إجبارية');
  }
  return await violationsRepository.createViolation({
    ...data,
    month: data.month || new Date().toISOString().slice(0, 7)
  });
}

module.exports = {
  listViolations,
  recordViolation
};
