const dashboardService = require('./dashboard.service');
const { BadRequestError } = require('../../shared/errors');

/**
 * Controller to handle GET /api/v1/dashboard
 */
async function getDashboard(req, res, next) {
  try {
    const month = req.query.month || '2026-10';
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      throw new BadRequestError('صيغة معامل الشهر غير صحيحة، يجب أن تكون YYYY-MM');
    }

    const data = await dashboardService.getDashboardOverview(month);

    res.status(200).json({
      status: 'success',
      data
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDashboard
};
