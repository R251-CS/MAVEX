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
import { MavexLogo } from '../common/MavexLogo';

const NAV_ITEMS = [
  { path: '/', label: 'لوحة التحكم العامة', icon: LayoutDashboard, adminOnly: true },
  { path: '/technical-office', label: 'المكتب الفني', icon: Cpu, departmentId: 'technical_office' },
  { path: '/production', label: 'إدارة الإنتاج', icon: Factory, departmentId: 'production' },
  { path: '/planning-warehouse', label: 'التخطيط والمستودعات', icon: Boxes, departmentId: 'planning_warehouse' },
  { path: '/maintenance', label: 'الصيانة والتشغيل', icon: Wrench, departmentId: 'maintenance' },
  { path: '/finance', label: 'الحسابات والمالية', icon: DollarSign, departmentId: 'finance' },
  { path: '/quality', label: 'مراقبة الجودة', icon: CheckCircle2, departmentId: 'quality' },
  { path: '/safety', label: 'السلامة والصحة المهنية', icon: ShieldCheck, departmentId: 'safety' },
  { path: '/violations-admin', label: 'إدارة المخالفات والرقابة', icon: AlertOctagon, adminOnly: true },
];

export const Sidebar = ({ isOpen, onClose, isCollapsed = false, onToggleCollapse }) => {
  const { user, profile, logout, isAdmin, canAccess } = useAuth() || {};

  const handleLinkClick = () => {
    // Only close drawer on mobile/tablet screens
    if (typeof window !== 'undefined' && window.innerWidth <= 1024 && onClose) {
      onClose();
    }
  };

  // تصفية الروابط بدقة: الأدمن يرى كل شيء، بينما عضو/مدير القسم يرى فقط القسم التابع له
  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (isAdmin || profile?.role === 'admin') {
      return true;
    }

    if (item.adminOnly) {
      return false;
    }

    if (item.departmentId) {
      return canAccess ? canAccess([], item.departmentId) : false;
    }

    return false;
  });

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
          <MavexLogo size={36} />
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
          {!isCollapsed && (
            <div className="mx-sidebar__section-title">
              {isAdmin || profile?.role === 'admin' ? 'الأقسام والوحدات' : 'القسم المصرح به'}
            </div>
          )}
          {visibleNavItems.map((item) => {
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
