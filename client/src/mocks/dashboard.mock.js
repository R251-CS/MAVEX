export const mockDashboardData = {
  overallPerformance: 76,
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
      departmentId: 'quality',
      name: 'مراقبة الجودة',
      managerName: 'م. طارق محمود',
      performancePercentage: 92,
      route: '/quality',
      color: 'green',
      metrics: { inspectedLots: 68, defectRate: '1.2%' }
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
      departmentId: 'safety',
      name: 'السلامة والصحة المهنية',
      managerName: 'أ. محمود فوزي',
      performancePercentage: 85,
      route: '/safety',
      color: 'green',
      metrics: { incidentFreeDays: 142, audits: 4 }
    },
    {
      departmentId: 'violations_admin',
      name: 'إدارة المخالفات',
      managerName: 'أ. علاء إبراهيم',
      performancePercentage: 70,
      route: '/violations-admin',
      color: 'red',
      metrics: { resolvedCases: 11, pendingReview: 3 }
    }
  ]
};
