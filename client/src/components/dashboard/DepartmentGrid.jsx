import React from 'react';
import { DepartmentCard } from './DepartmentCard';
import {
  Cpu,
  Factory,
  Boxes,
  Wrench,
  DollarSign
} from 'lucide-react';

const DEPT_ICONS = {
  technical_office: { icon: Cpu, route: '/technical-office', color: 'blue' },
  production: { icon: Factory, route: '/production', color: 'cyan' },
  planning_warehouse: { icon: Boxes, route: '/planning-warehouse', color: 'green' },
  maintenance: { icon: Wrench, route: '/maintenance', color: 'amber' },
  finance: { icon: DollarSign, route: '/finance', color: 'green' }
};


export const DepartmentGrid = ({ departments = [] }) => {
  const activeDepartments = departments.filter(
    (dept) => !['quality', 'safety', 'violations'].includes(dept.departmentId)
  );

  return (
    <div className="mx-dashboard-grid" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '1.25rem'
    }}>
      {activeDepartments.map((dept) => {
        const meta = DEPT_ICONS[dept.departmentId] || { icon: Cpu, route: '/', color: 'blue' };
        return (
          <DepartmentCard
            key={dept.departmentId}
            departmentId={dept.departmentId}
            name={dept.name}
            managerName={dept.managerName}
            performancePercentage={dept.performancePercentage}
            route={meta.route}
            icon={meta.icon}
            color={meta.color}
          />
        );
      })}
    </div>
  );
};
