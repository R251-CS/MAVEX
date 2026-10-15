const { AppError } = require('../shared/errors');

function errorHandler(err, req, res, next) {
  let error = err;

  if (!(error instanceof AppError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'حدث خطأ داخلي في الخادم';
    error = new AppError(message, statusCode);
  }

  // Hide details in production
  const response = {
    status: error.status,
    message: error.message
  };

  if (error.details) {
    response.details = error.details;
  }

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(error.statusCode).json(response);
}

module.exports = errorHandler;
