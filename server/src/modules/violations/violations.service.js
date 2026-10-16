const violationsRepository = require('./violations.repository');
const { BadRequestError } = require('../../shared/errors');

async function listViolations(month) {
  return await violationsRepository.getViolations(month);
}

async function recordViolation(data) {
  const title = data.title || data.description;
  const departmentId = data.departmentId || data.dept;

  if (!title || !departmentId) {
    throw new BadRequestError('عنوان أو وصف المخالفة والقسم المعني حقول إجبارية');
  }

  return await violationsRepository.createViolation({
    ...data,
    title,
    departmentId,
    month: data.month || new Date().toISOString().slice(0, 7)
  });
}


async function modifyViolation(id, data) {
  if (!id) {
    throw new BadRequestError('معرف المخالفة مطلوب');
  }
  const updated = await violationsRepository.updateViolation(id, data);
  if (!updated) {
    throw new BadRequestError('المخالفة غير موجودة');
  }
  return updated;
}

module.exports = {
  listViolations,
  recordViolation,
  modifyViolation
};

