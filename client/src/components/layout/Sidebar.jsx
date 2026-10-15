import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Cpu,
  Factory,
  CheckCircle2,
  Boxes,
  Wrench,
  ShieldAlert,
  AlertOctagon,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { path: '/', label: 'لوحة التحكم العامة', icon: LayoutDashboard },
  { path: '/technical-office', label: 'المكتب الفني', icon: Cpu },
  { path: '/production', label: 'إدارة الإنتاج', icon: Factory },
  { path: '/quality', label: 'مراقبة الجودة', icon: CheckCircle2 },
  { path: '/planning-warehouse', label: 'التخطيط والمستودعات', icon: Boxes },
  { path: '/maintenance', label: 'الصيانة والتشغيل', icon: Wrench },
  { path: '/safety', label: 'السلامة والصحة المهنية', icon: ShieldAlert },
  { path: '/violations-admin', label: 'إدارة المخالفات', icon: AlertOctagon },
];

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, profile, logout } = useAuth() || {};

  return (
    <>
      {isOpen && (
        <div
          className="mx-sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside className={`mx-sidebar ${isOpen ? 'mx-sidebar--open' : ''}`}>
        <div className="mx-sidebar__brand">
          <div className="mx-sidebar__logo-badge">M</div>
          <div className="mx-sidebar__brand-text">
            <span className="mx-sidebar__title">MAVEX</span>
            <span className="mx-sidebar__subtitle">نظام الإدارة الصناعية</span>
          </div>
        </div>

        <nav className="mx-sidebar__nav">
          <div className="mx-sidebar__section-title">الأقسام والوحدات</div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `mx-sidebar__link ${isActive ? 'mx-sidebar__link--active' : ''}`
                }
                end={item.path === '/'}
              >
                <Icon size={19} className="mx-sidebar__link-icon" />
                <span className="mx-sidebar__link-text">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mx-sidebar__footer">
          <div className="mx-sidebar__user">
            <div className="mx-sidebar__avatar">
              <User size={18} />
            </div>
            <div className="mx-sidebar__user-info">
              <span className="mx-sidebar__user-name">
                {profile?.name || user?.email || 'مسؤول النظام'}
              </span>
              <span className="mx-sidebar__user-role">
                {profile?.role === 'admin' ? 'مدير عام' : 'مدير قسم'}
              </span>
            </div>
            {logout && (
              <button
                type="button"
                onClick={logout}
                className="mx-sidebar__logout-btn"
                title="تسجيل الخروج"
                aria-label="تسجيل الخروج"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
