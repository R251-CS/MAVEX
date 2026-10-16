import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GlassCard, Button, TextField } from '../../components/common';
import { Lock, Mail, ShieldAlert, LogIn, UserPlus } from 'lucide-react';
import { useToast } from '../../components/common/Toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth() || {};
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const handleSuccessfulAuth = () => {
    addToast('تم تسجيل الدخول بنجاح', 'success');
    const from = location?.state?.from?.pathname || '/';
    navigate(from, { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (login) {
        await login(email, password);
      }
      handleSuccessfulAuth();
    } catch (err) {
      setError(err.message || 'فشل تسجيل الدخول. يرجى التحقق من البريد وكلمة المرور.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      background: 'radial-gradient(circle at top, rgba(59, 130, 246, 0.15), transparent 70%), var(--bg-app)'
    }}>
      <GlassCard glow="blue" style={{ maxWidth: '480px', width: '100%', padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            display: 'inline-flex',
            width: '54px',
            height: '54px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
            color: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 800,
            marginBottom: '1rem',
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
          }}>
            M
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.5rem' }}>
            تسجيل الدخول — MAVEX
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
            نظام إدارة العمليات الصناعية ومؤشرات الأداء
          </p>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(239, 68, 68, 0.15)',
            color: 'var(--accent-red)',
            fontSize: '0.875rem',
            marginBottom: '1.25rem'
          }}>
            <ShieldAlert size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="البريد الإلكتروني"
            type="email"
            icon={Mail}
            placeholder="admin@mavex.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />

          <TextField
            label="كلمة المرور"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            icon={LogIn}
            isLoading={loading}
            style={{ width: '100%', marginTop: '1.5rem' }}
          >
            دخول إلى النظام
          </Button>
        </form>

        {/* Link to Register */}
        <div style={{
          textAlign: 'center',
          marginTop: '1.25rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '0.875rem',
          color: 'var(--text-secondary)'
        }}>
          ليس لديك حساب؟{' '}
          <Link
            to="/register"
            style={{
              color: 'var(--accent-blue)',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <UserPlus size={14} /> إنشاء حساب جديد
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
