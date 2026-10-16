import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Factory, Cpu, CheckCircle2, Boxes, Wrench, ShieldCheck, DollarSign } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MOBILE_ITEMS = [
  { path: '/', label: 'الرئيسية', icon: LayoutDashboard, adminOnly: true },
  { path: '/technical-office', label: 'المكتب الفني', icon: Cpu, departmentId: 'technical_office' },
  { path: '/production', label: 'الإنتاج', icon: Factory, departmentId: 'production' },
  { path: '/planning-warehouse', label: 'المخازن', icon: Boxes, departmentId: 'planning_warehouse' },
  { path: '/maintenance', label: 'الصيانة', icon: Wrench, departmentId: 'maintenance' },
  { path: '/quality', label: 'الجودة', icon: CheckCircle2, departmentId: 'quality' },
  { path: '/safety', label: 'السلامة', icon: ShieldCheck, departmentId: 'safety' },
  { path: '/finance', label: 'المالية', icon: DollarSign, departmentId: 'finance' }
];

export const MobileNav = () => {
  const { profile, isAdmin, canAccess } = useAuth() || {};

  const visibleItems = MOBILE_ITEMS.filter((item) => {
    if (isAdmin || profile?.role === 'admin') return true;
    if (item.adminOnly) return false;
    if (item.departmentId) return canAccess ? canAccess([], item.departmentId) : false;
    return false;
  });

  return (
    <nav className="mx-mobile-nav" aria-label="التنقل السريع للجوال">
      {visibleItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `mx-mobile-nav__item ${isActive ? 'mx-mobile-nav__item--active' : ''}`
            }
            end={item.path === '/'}
          >
            <Icon size={20} className="mx-mobile-nav__icon" />
            <span className="mx-mobile-nav__label">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
