const { ForbiddenError, UnauthorizedError } = require('../shared/errors');
const { ROLES, normalizeRole } = require('../shared/constants');

/**
 * Authorize middleware checking user role and department scope
 * @param {Array<string>|string} allowedRoles
 * @param {Object} options - e.g. { checkDepartment: true, department: 'finance' }
 */
function authorize(allowedRoles = [], options = {}) {
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  const normalizedAllowed = rolesArray.map(normalizeRole);

  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('يجب تسجيل الدخول أولاً'));
    }

    const userRole = normalizeRole(req.user.role);

    // Admins bypass all role and department restrictions
    if (userRole === ROLES.ADMIN) {
      return next();
    }

    // Role check
    if (normalizedAllowed.length > 0 && !normalizedAllowed.includes(userRole)) {
      return next(new ForbiddenError('ليس لديك صلاحية الدور المطلوب لتنفيذ هذا الإجراء'));
    }

    // Specific required department (e.g. options.department = 'finance')
    if (options.department) {
      if (!req.user.departmentId || req.user.departmentId !== options.department) {
        return next(new ForbiddenError('غير مصرح لك بالوصول لبيانات هذا القسم'));
      }
    }

    // Dynamic department check from request params/query/body
    if (options.checkDepartment) {
      const requestedDept = req.params.departmentId || req.query.departmentId || req.body.departmentId;
      if (requestedDept) {
        if (!req.user.departmentId || req.user.departmentId !== requestedDept) {
          return next(new ForbiddenError('غير مصرح لك بالوصول لبيانات قسم آخر'));
        }
      }
    }

    next();
  };
}

module.exports = authorize;

