import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Factory, Cpu, CheckCircle2, Boxes } from 'lucide-react';

const QUICK_NAV = [
  { path: '/', label: 'الرئيسية', icon: LayoutDashboard },
  { path: '/technical-office', label: 'الفني', icon: Cpu },
  { path: '/production', label: 'الإنتاج', icon: Factory },
  { path: '/quality', label: 'الجودة', icon: CheckCircle2 },
  { path: '/planning-warehouse', label: 'المخازن', icon: Boxes }
];

export const MobileNav = () => {
  return (
    <nav className="mx-mobile-nav" aria-label="التنقل السريع للجوال">
      {QUICK_NAV.map((item) => {
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
