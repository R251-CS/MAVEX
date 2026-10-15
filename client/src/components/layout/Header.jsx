import React from 'react';
import { Menu, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useMonth } from '../../context/MonthContext';
import { useAuth } from '../../context/AuthContext';
import { MonthPicker } from '../common/MonthPicker';
import { IconButton } from '../common/IconButton';

export const Header = ({ onToggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { selectedMonth, setSelectedMonth } = useMonth();
  const { user, logout } = useAuth() || {};

  return (
    <header className="mx-header">
      <div className="mx-header__inner">
        <div className="mx-header__start">
          <IconButton
            icon={Menu}
            label="القائمة الجانبية"
            onClick={onToggleSidebar}
            className="mx-header__menu-btn"
          />
          <div className="mx-header__badge-pill">
            <span className="mx-header__pulse-dot" />
            <span className="mx-header__system-status">النظام متصل</span>
          </div>
        </div>

        <div className="mx-header__end">
          <div className="mx-header__month-container">
            <MonthPicker
              value={selectedMonth}
              onChange={setSelectedMonth}
            />
          </div>

          <IconButton
            icon={theme === 'dark' ? Sun : Moon}
            label={theme === 'dark' ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
            onClick={toggleTheme}
            className="mx-theme-toggle"
          />

          {user && logout && (
            <IconButton
              icon={LogOut}
              label="تسجيل الخروج"
              onClick={logout}
              variant="danger"
              className="mx-header__logout"
            />
          )}
        </div>
      </div>
    </header>
  );
};
