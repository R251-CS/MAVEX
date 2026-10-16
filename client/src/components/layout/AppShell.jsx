import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

const ROUTE_TITLES = {
  '/': 'لوحة التحكم العامة',
  '/technical-office': 'المكتب الفني',
  '/production': 'إدارة الإنتاج',
  '/planning-warehouse': 'التخطيط والمستودعات',
  '/maintenance': 'الصيانة والتشغيل',
  '/finance': 'الحسابات والمالية',
  '/quality': 'مراقبة الجودة',
  '/safety': 'السلامة والصحة المهنية',
  '/violations-admin': 'إدارة المخالفات والرقابة'
};

export const AppShell = () => {
  const location = useLocation();

  useEffect(() => {
    const pageTitle = ROUTE_TITLES[location.pathname] || 'نظام الإدارة الصناعية';
    document.title = `MAVEX | ${pageTitle}`;
  }, [location.pathname]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('mavex_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
      setSidebarOpen((prev) => !prev);
    } else {
      toggleCollapse();
    }
  };

  const toggleCollapse = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('mavex_sidebar_collapsed', String(next));
      } catch (e) {}
      return next;
    });
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Close mobile drawer on desktop resize and handle Escape key
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setSidebarOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [sidebarOpen]);

  return (
    <div className={`mx-app-shell ${sidebarCollapsed ? 'mx-app-shell--collapsed' : ''}`}>
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={closeSidebar} 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleCollapse}
      />

      <div className="mx-app-shell__body">
        <Header onToggleSidebar={toggleSidebar} />
        <main className="mx-app-shell__main">
          <Outlet />
        </main>
      </div>

      <MobileNav />
    </div>
  );
};
