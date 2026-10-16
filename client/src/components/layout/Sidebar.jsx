import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Cpu,
  Factory,
  Boxes,
  Wrench,
  DollarSign,
  CheckCircle2,
  ShieldCheck,
  AlertOctagon,
  LogOut,
  User,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { path: '/', label: 'لوحة التحكم العامة', icon: LayoutDashboard },
  { path: '/technical-office', label: 'المكتب الفني', icon: Cpu },
  { path: '/production', label: 'إدارة الإنتاج', icon: Factory },
  { path: '/planning-warehouse', label: 'التخطيط والمستودعات', icon: Boxes },
  { path: '/maintenance', label: 'الصيانة والتشغيل', icon: Wrench },
  { path: '/finance', label: 'الحسابات والمالية', icon: DollarSign },
  { path: '/quality', label: 'مراقبة الجودة', icon: CheckCircle2 },
  { path: '/safety', label: 'السلامة والصحة المهنية', icon: ShieldCheck },
  { path: '/violations-admin', label: 'إدارة المخالفات والرقابة', icon: AlertOctagon, adminOnly: true },
];

export const Sidebar = ({ isOpen, onClose, isCollapsed = false, onToggleCollapse }) => {
  const { user, profile, logout, isAdmin } = useAuth() || {};

  const handleLinkClick = () => {
    // Only close drawer on mobile/tablet screens
    if (typeof window !== 'undefined' && window.innerWidth <= 1024 && onClose) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="mx-sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside 
        className={`mx-sidebar ${isOpen ? 'mx-sidebar--open' : ''} ${isCollapsed ? 'mx-sidebar--collapsed' : ''}`}
        aria-label="شريط التنقل الرئيسي"
      >
        <div className="mx-sidebar__brand">
          <div className="mx-sidebar__logo-badge" title="MAVEX Metals">M</div>
          {!isCollapsed && (
            <div className="mx-sidebar__brand-text">
              <span className="mx-sidebar__title">MAVEX</span>
              <span className="mx-sidebar__subtitle">نظام الإدارة الصناعية</span>
            </div>
          )}
          {onToggleCollapse && (
            <button
              type="button"
              className="mx-sidebar__collapse-btn"
              onClick={onToggleCollapse}
              title={isCollapsed ? 'توسيع القائمة' : 'طي القائمة'}
              aria-label={isCollapsed ? 'توسيع القائمة' : 'طي القائمة'}
            >
              {isCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
        </div>

        <nav className="mx-sidebar__nav">
          {!isCollapsed && <div className="mx-sidebar__section-title">الأقسام والوحدات</div>}
          {NAV_ITEMS.map((item) => {
            if (item.adminOnly && !isAdmin) {
              return null;
            }

            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `mx-sidebar__link ${isActive ? 'mx-sidebar__link--active' : ''}`
                }
                title={isCollapsed ? item.label : undefined}
                end={item.path === '/'}
              >
                <Icon size={19} className="mx-sidebar__link-icon" />
                {!isCollapsed && <span className="mx-sidebar__link-text">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="mx-sidebar__footer">
          <div className="mx-sidebar__user">
            <div className="mx-sidebar__avatar" title={profile?.name || user?.email || 'المستخدم'}>
              <User size={18} />
            </div>
            {!isCollapsed && (
              <div className="mx-sidebar__user-info">
                <span className="mx-sidebar__user-name">
                  {profile?.name || user?.email || 'مسؤول النظام'}
                </span>
                <span className="mx-sidebar__user-role">
                  {profile?.role === 'admin' ? 'مدير عام (أدمن)' : (profile?.title || 'مدير قسم')}
                </span>
              </div>
            )}
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
