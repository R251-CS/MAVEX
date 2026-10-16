const DEPARTMENTS = {
  TECHNICAL_OFFICE: 'technical_office',
  PRODUCTION: 'production',
  PLANNING_WAREHOUSE: 'planning_warehouse',
  MAINTENANCE: 'maintenance',
  FINANCE: 'finance'
};

const DEPARTMENT_NAMES_AR = {
  [DEPARTMENTS.TECHNICAL_OFFICE]: 'المكتب الفني',
  [DEPARTMENTS.PRODUCTION]: 'الإنتاج',
  [DEPARTMENTS.PLANNING_WAREHOUSE]: 'التخطيط والمستودعات',
  [DEPARTMENTS.MAINTENANCE]: 'الصيانة والتشغيل',
  [DEPARTMENTS.FINANCE]: 'الحسابات والمالية'
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
