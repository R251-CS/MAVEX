const { ForbiddenError } = require('../shared/errors');
const { ROLES } = require('../shared/constants');

/**
 * Authorize middleware checking user role and department scope
 * @param {Array<string>} allowedRoles 
 * @param {Object} options - e.g. { checkDepartment: true }
 */
function authorize(allowedRoles = [], options = {}) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ForbiddenError('غير مصرح بالوصول'));
    }

    // Admins bypass department checks
    if (req.user.role === ROLES.ADMIN) {
      return next();
    }

    // Check role
    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError('ليس لديك صلاحية الدور المطلوب لتنفيذ هذا الإجراء'));
    }

    // Check department scope if required
    if (options.checkDepartment) {
      const requestedDept = req.params.departmentId || req.query.departmentId || req.body.departmentId;
      if (requestedDept && req.user.departmentId && req.user.departmentId !== requestedDept) {
        return next(new ForbiddenError('غير مصرح لك بالوصول لبيانات قسم آخر'));
      }
    }

    next();
  };
}

module.exports = authorize;
