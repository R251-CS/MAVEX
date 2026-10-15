import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

export const AppShell = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="mx-app-shell">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

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
