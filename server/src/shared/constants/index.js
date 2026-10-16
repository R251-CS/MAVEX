const DEPARTMENTS = {
  TECHNICAL_OFFICE: 'technical_office',
  PRODUCTION: 'production',
  PLANNING_WAREHOUSE: 'planning_warehouse',
  MAINTENANCE: 'maintenance',
  FINANCE: 'finance',
  QUALITY: 'quality',
  SAFETY: 'safety',
  VIOLATIONS: 'violations'
};

const DEPARTMENT_NAMES_AR = {
  [DEPARTMENTS.TECHNICAL_OFFICE]: 'المكتب الفني',
  [DEPARTMENTS.PRODUCTION]: 'الإنتاج',
  [DEPARTMENTS.PLANNING_WAREHOUSE]: 'التخطيط والمستودعات',
  [DEPARTMENTS.MAINTENANCE]: 'الصيانة والتشغيل',
  [DEPARTMENTS.FINANCE]: 'الحسابات والمالية',
  [DEPARTMENTS.QUALITY]: 'مراقبة الجودة',
  [DEPARTMENTS.SAFETY]: 'السلامة والصحة المهنية',
  [DEPARTMENTS.VIOLATIONS]: 'إدارة المخالفات'
};

const ROLES = {
  ADMIN: 'admin',
  DEPARTMENT_MANAGER: 'department_manager',
  DEPARTMENT_MEMBER: 'department_member'
};

/**
 * Normalizes user roles, supporting shorthand forms (e.g. 'manager' -> 'department_manager')
 * @param {string} role
 * @returns {string}
 */
function normalizeRole(role) {
  if (!role) return ROLES.DEPARTMENT_MEMBER;
  const lower = String(role).trim().toLowerCase();
  if (lower === 'admin' || lower === 'superadmin' || lower === 'administrator') {
    return ROLES.ADMIN;
  }
  if (lower === 'manager' || lower === 'department_manager' || lower === 'dept_manager') {
    return ROLES.DEPARTMENT_MANAGER;
  }
  return ROLES.DEPARTMENT_MEMBER;
}

module.exports = {
  DEPARTMENTS,
  DEPARTMENT_NAMES_AR,
  ROLES,
  normalizeRole
};

