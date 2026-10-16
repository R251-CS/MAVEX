import React from 'react';
import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { Button } from './Button';

/**
 * ProtectedRoute - يحمي الصفحات والمسارات الفرعية
 * يتحقق من تسجيل الدخول وصلاحيات الأدوار والقسم إن طُلبت
 */
export function ProtectedRoute({ children, allowedRoles, requiredDepartment }) {
  const { user, profile, loading, canAccess } = useAuth();
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

  // فحص صلاحيات الدور أو القسم إن كانت محددة لهذا المسار
  if ((allowedRoles && allowedRoles.length > 0) || requiredDepartment) {
    const hasPermission = canAccess(allowedRoles || [], requiredDepartment);
    if (!hasPermission) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '70vh',
          padding: '2rem'
        }}>
          <GlassCard style={{ maxWidth: '500px', textAlign: 'center', padding: '2.5rem 2rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              color: 'var(--color-danger)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <ShieldAlert size={28} />
            </div>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
              غير مصرح بالدخول لهذا القسم
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1.75rem', lineHeight: 1.6 }}>
              حسابك الحالي ({profile?.name || user.email}) لا يمتلك الصلاحية الكافية لعرض هذا القسم أو تعديل بياناته.
            </p>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Button variant="primary" icon={ArrowRight}>
                العودة للوحة المؤشرات العامة
              </Button>
            </Link>
          </GlassCard>
        </div>
      );
    }
  }

  // إذا استُخدم كـ wrapper لـ children مباشرة (Route element)
  return children ? children : <Outlet />;
}


