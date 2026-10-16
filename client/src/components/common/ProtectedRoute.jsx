import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute - يحمي الصفحات ويعيد توجيه المستخدم غير المسجّل إلى صفحة تسجيل الدخول
 * يُستخدم كـ Route element wrapper عبر <Outlet /> للـ nested routes
 */
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#0a0f1d',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '3px solid rgba(59, 130, 246, 0.2)',
          borderTopColor: '#3b82f6',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: 'rgba(248, 250, 252, 0.6)', fontFamily: 'Cairo, sans-serif', fontSize: '0.875rem' }}>
          جاري التحقق من الجلسة...
        </p>
      </div>
    );
  }

  if (!user) {
    // حفظ الصفحة المطلوبة للتوجيه بعد تسجيل الدخول
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // إذا استُخدم كـ wrapper لـ children مباشرة (Route element)
  return children ? children : <Outlet />;
}

