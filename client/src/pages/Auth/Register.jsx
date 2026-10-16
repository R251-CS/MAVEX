import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, getDepartmentRoute } from '../../context/AuthContext';
import { GlassCard, Button, TextField, SelectField, MavexLogo } from '../../components/common';
import { Lock, Mail, User, ShieldAlert, UserPlus, ArrowRight, Briefcase, Building } from 'lucide-react';
import { useToast } from '../../components/common/Toast';

// الأدوار المسموح بإنشائها عبر التسجيل (يُستثنى الأدمن تماماً لأسباب أمنية)
const ROLE_OPTIONS = [
  { value: 'department_member', label: 'عضو / فني تشغيل بالقسم (Department Member)' },
  { value: 'department_manager', label: 'مدير قسم صناعي / تنفيذي (Department Manager)' }
];

const DEPARTMENT_OPTIONS = [
  { value: 'technical_office', label: 'المكتب الفني' },
  { value: 'production', label: 'إدارة الإنتاج' },
  { value: 'maintenance', label: 'الصيانة والتشغيل' },
  { value: 'planning_warehouse', label: 'التخطيط والمستودعات' },
  { value: 'finance', label: 'الحسابات والمالية' }
];

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'department_member',
    departmentId: 'production'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const { register } = useAuth() || {};
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    document.title = 'MAVEX | إنشاء حساب جديد';
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim() || form.name.trim().length < 3)
      newErrors.name = 'الاسم يجب أن يكون 3 أحرف على الأقل';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'البريد الإلكتروني غير صالح';
    if (!form.role)
      newErrors.role = 'يرجى تحديد الدور الوظيفي';
    if (!form.departmentId)
      newErrors.departmentId = 'يرجى اختيار القسم التابع له';
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
        await register(
          form.email,
          form.password,
          form.name.trim(),
          form.role,
          form.departmentId
        );
      }
      addToast('تم إنشاء الحساب بنجاح! مرحباً بك في MAVEX', 'success');
      const targetRoute = form.role === 'admin' ? '/' : getDepartmentRoute(form.departmentId);
      navigate(targetRoute);
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
      padding: '2rem 1.5rem',
      background: 'radial-gradient(circle at top right, rgba(25, 91, 77, 0.15), transparent 60%), radial-gradient(circle at bottom left, rgba(39, 132, 232, 0.1), transparent 60%), var(--bg-app)'
    }}>
      <GlassCard glow="blue" style={{ maxWidth: '520px', width: '100%', padding: '2.5rem 2rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <MavexLogo size={58} style={{ marginBottom: '1rem', filter: 'drop-shadow(0 6px 18px rgba(0, 242, 254, 0.3))' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: '0 0 0.5rem' }}>
            إنشاء حساب مستخدم جديد
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
            انضم إلى فريق العمل بنظام MAVEX لإدارة المنشآت الصناعية
          </p>
        </div>

        {/* Global Error */}
        {globalError && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-danger-bg)',
            border: '1px solid var(--color-danger-border)',
            color: 'var(--color-danger)',
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
            placeholder="مثال: م. أحمد عبد العزيز"
            value={form.name}
            onChange={handleChange('name')}
            error={errors.name}
            required
            autoFocus
          />

          <TextField
            label="البريد الإلكتروني المهني"
            type="email"
            icon={Mail}
            placeholder="engineer@mavex.com"
            value={form.email}
            onChange={handleChange('email')}
            error={errors.email}
            required
          />

          {/* اختيار الدور الوظيفي - مستثنى منه الأدمن */}
          <SelectField
            label="الدور الوظيفي والصلاحية"
            value={form.role}
            onChange={handleChange('role')}
            options={ROLE_OPTIONS}
            error={errors.role}
            required
            helperText="ملاحظة: صلاحية مسؤول النظام (أدمن) تُمنح حصرياً من الإدارة العليا"
          />

          {/* اختيار القسم الصناعي التابع له */}
          <SelectField
            label="القسم / الإدارة الصناعية"
            value={form.departmentId}
            onChange={handleChange('departmentId')}
            options={DEPARTMENT_OPTIONS}
            error={errors.departmentId}
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
              padding: '0.875rem'
            }}
          >
            إتمام إنشاء الحساب
          </Button>
        </form>

        {/* Link to Login */}
        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--color-border)',
          fontSize: '0.875rem',
          color: 'var(--color-text-secondary)'
        }}>
          لديك حساب مسجل بالفعل؟{' '}
          <Link
            to="/login"
            style={{
              color: 'var(--color-primary)',
              fontWeight: 700,
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
