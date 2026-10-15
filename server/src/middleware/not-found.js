const { NotFoundError } = require('../shared/errors');

function notFound(req, res, next) {
  next(new NotFoundError(`المسار غير موجود: ${req.originalUrl}`));
}

module.exports = notFound;
