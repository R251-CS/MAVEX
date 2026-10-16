import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GlassCard, Button, TextField } from '../../components/common';
import { Lock, Mail, User, ShieldAlert, UserPlus, ArrowRight } from 'lucide-react';
import { useToast } from '../../components/common/Toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const { register } = useAuth() || {};
  const navigate = useNavigate();
  const { addToast } = useToast();

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim() || form.name.trim().length < 3)
      newErrors.name = 'الاسم يجب أن يكون 3 أحرف على الأقل';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'البريد الإلكتروني غير صالح';
    if (!form.password || form.password.length < 6)
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'كلمتا المرور غير متطابقتين';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    setGlobalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setGlobalError('');

    try {
      if (register) {
        await register(form.email, form.password, form.name.trim());
      }
      addToast('تم إنشاء الحساب بنجاح! مرحباً بك', 'success');
      navigate('/');
    } catch (err) {
      setGlobalError(err.message || 'فشل إنشاء الحساب. حاول مرة أخرى.');
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
      background: 'radial-gradient(circle at top right, rgba(139, 92, 246, 0.15), transparent 60%), radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.1), transparent 60%), var(--bg-app)'
    }}>
      <GlassCard glow="purple" style={{ maxWidth: '480px', width: '100%', padding: '2.5rem 2rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            width: '54px',
            height: '54px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
            color: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 800,
            marginBottom: '1rem',
            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)'
          }}>
            M
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.5rem' }}>
            إنشاء حساب جديد
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
            انضم إلى نظام MAVEX لإدارة العمليات الصناعية
          </p>
        </div>

        {/* Global Error */}
        {globalError && (
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
            <span>{globalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label="الاسم الكامل"
            type="text"
            icon={User}
            placeholder="محمد أحمد"
            value={form.name}
            onChange={handleChange('name')}
            error={errors.name}
            required
            autoFocus
          />

          <TextField
            label="البريد الإلكتروني"
            type="email"
            icon={Mail}
            placeholder="user@mavex.com"
            value={form.email}
            onChange={handleChange('email')}
            error={errors.email}
            required
          />

          <TextField
            label="كلمة المرور"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange('password')}
            error={errors.password}
            helperText="6 أحرف على الأقل"
            required
          />

          <TextField
            label="تأكيد كلمة المرور"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={handleChange('confirmPassword')}
            error={errors.confirmPassword}
            required
          />

          <Button
            type="submit"
            variant="primary"
            icon={UserPlus}
            isLoading={loading}
            style={{
              width: '100%',
              marginTop: '1.5rem',
              background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))'
            }}
          >
            إنشاء الحساب
          </Button>
        </form>

        {/* Link to Login */}
        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '0.875rem',
          color: 'var(--text-secondary)'
        }}>
          لديك حساب بالفعل؟{' '}
          <Link
            to="/login"
            style={{
              color: 'var(--accent-blue)',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            تسجيل الدخول <ArrowRight size={14} />
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
