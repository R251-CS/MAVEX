const DEPARTMENTS = {
  TECHNICAL_OFFICE: 'technical_office',
  PRODUCTION: 'production',
  QUALITY: 'quality',
  PLANNING_WAREHOUSE: 'planning_warehouse',
  MAINTENANCE: 'maintenance',
  SAFETY: 'safety',
  VIOLATIONS_ADMIN: 'violations_admin'
};

const DEPARTMENT_NAMES_AR = {
  [DEPARTMENTS.TECHNICAL_OFFICE]: 'المكتب الفني',
  [DEPARTMENTS.PRODUCTION]: 'الإنتاج',
  [DEPARTMENTS.QUALITY]: 'الجودة',
  [DEPARTMENTS.PLANNING_WAREHOUSE]: 'التخطيط والمخازن',
  [DEPARTMENTS.MAINTENANCE]: 'الصيانة',
  [DEPARTMENTS.SAFETY]: 'السلامة والصحة المهنية',
  [DEPARTMENTS.VIOLATIONS_ADMIN]: 'المخالفات والإدارة العليا'
};

const ROLES = {
  ADMIN: 'admin',
  DEPARTMENT_MANAGER: 'department_manager',
  DEPARTMENT_MEMBER: 'department_member'
};

module.exports = {
  DEPARTMENTS,
  DEPARTMENT_NAMES_AR,
  ROLES
};
