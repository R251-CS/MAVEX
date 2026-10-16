export const mockDashboardData = {
  overallPerformance: 81,
  departments: [
    {
      departmentId: 'technical_office',
      name: 'المكتب الفني',
      managerName: 'م. أحمد حسن',
      performancePercentage: 95,
      route: '/technical-office',
      color: 'blue',
      metrics: { completedDrawings: 42, activeJobs: 8 }
    },
    {
      departmentId: 'production',
      name: 'إدارة الإنتاج',
      managerName: 'م. سامح عزت',
      performancePercentage: 84,
      route: '/production',
      color: 'cyan',
      metrics: { activeOrders: 14, efficiency: 88 }
    },
    {
      departmentId: 'planning_warehouse',
      name: 'التخطيط والمستودعات',
      managerName: 'أ. خالد السيد',
      performancePercentage: 78,
      route: '/planning-warehouse',
      color: 'purple',
      metrics: { stockLevel: '94%', leadTime: '3 أيام' }
    },
    {
      departmentId: 'maintenance',
      name: 'الصيانة والتشغيل',
      managerName: 'م. ياسر عبد الله',
      performancePercentage: 91,
      route: '/maintenance',
      color: 'amber',
      metrics: { uptime: '98.5%', openTickets: 2 }
    },
    {
      departmentId: 'finance',
      name: 'الحسابات والمالية',
      managerName: 'أ. رامي سالم',
      performancePercentage: 88,
      route: '/finance',
      color: 'green',
      metrics: { income: '630,000 ج.م', expenses: '195,000 ج.م' }
    },
    {
      departmentId: 'quality',
      name: 'مراقبة الجودة',
      managerName: 'م. طارق محمود',
      performancePercentage: 95,
      route: '/quality',
      color: 'green',
      metrics: { acceptance: '95%', inspections: 28 }
    },
    {
      departmentId: 'safety',
      name: 'السلامة والصحة المهنية',
      managerName: 'أ. محمود فوزي',
      performancePercentage: 94,
      route: '/safety',
      color: 'cyan',
      metrics: { zeroIncidentsDays: 142, auditsScore: '92%' }
    },
    {
      departmentId: 'violations',
      name: 'إدارة المخالفات والرقابة',
      managerName: 'أ. علاء إبراهيم',
      performancePercentage: 86,
      route: '/violations-admin',
      color: 'red',
      metrics: { activeViolations: 3, resolved: 18 }
    }
  ]
};

