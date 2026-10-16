import React from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import { PageContainer, PageHeader, Skeleton, ErrorState, GlassCard } from '../../components/common';
import { OverallPerformanceCard } from '../../components/dashboard/OverallPerformanceCard';
import { DepartmentGrid } from '../../components/dashboard/DepartmentGrid';
import { PerformanceChart } from '../../components/dashboard/PerformanceChart';
import { RotateCw, Zap, CheckCircle2, Factory, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/common/Button';

export default function Dashboard() {
  const { data, loading, error, refresh, selectedMonth } = useDashboard();

  if (loading) {
    return (
      <PageContainer>
        <PageHeader
          title="لوحة المؤشرات والقيادة العامة"
          description="متابعة لحظية لمعدلات الأداء ومؤشرات الإنجاز لجميع الأقسام الصناعية."
        />
        {/* KPI Skeleton Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height="100px" borderRadius="var(--radius-lg)" />
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <Skeleton height="320px" borderRadius="var(--radius-lg)" />
          <Skeleton height="320px" borderRadius="var(--radius-lg)" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {Array.from({ length: 7 }).map((_, idx) => (
            <Skeleton key={idx} height="220px" borderRadius="var(--radius-lg)" />
          ))}
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState message={error} onRetry={refresh} />
      </PageContainer>
    );
  }

  const overall = data?.overallPerformance ?? 76;
  const departments = data?.departments ?? [];

  return (
    <PageContainer>
      <PageHeader
        title="لوحة المؤشرات والقيادة العامة"
        description={`تقرير كفاءة العمليات الصناعية والأقسام التشغيلية لشهر ${selectedMonth}.`}
        actions={
          <Button variant="secondary" icon={RotateCw} size="sm" onClick={refresh}>
            تحديث المؤشرات
          </Button>
        }
      />

      {/* ─── Top Executive KPI Highlights Row (Clean corporate cards without neon shadows) ─── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.75rem'
      }}>
        <GlassCard style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-primary-bg)',
            border: '1px solid var(--color-primary-border)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Zap size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>الكفاءة العامة</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem', marginTop: '0.125rem' }}>
              <span style={{ fontSize: '1.625rem', fontWeight: 900, color: 'var(--color-text-primary)', lineHeight: 1 }}>{overall}%</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 700 }}>+4.2%</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-cyan-bg)',
            border: '1px solid rgba(2, 132, 199, 0.25)',
            color: 'var(--color-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Factory size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>أوامر الإنتاج النشطة</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem', marginTop: '0.125rem' }}>
              <span style={{ fontSize: '1.625rem', fontWeight: 900, color: 'var(--color-text-primary)', lineHeight: 1 }}>14 أمر</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>قيد التصنيع</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-success-bg)',
            border: '1px solid var(--color-success-border)',
            color: 'var(--color-success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>مؤشر جودة الفحص</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem', marginTop: '0.125rem' }}>
              <span style={{ fontSize: '1.625rem', fontWeight: 900, color: 'var(--color-text-primary)', lineHeight: 1 }}>95.8%</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 700 }}>اجتياز تام</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-violet-bg)',
            border: '1px solid rgba(124, 58, 237, 0.25)',
            color: 'var(--color-violet)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>جاهزية الماكينات</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem', marginTop: '0.125rem' }}>
              <span style={{ fontSize: '1.625rem', fontWeight: 900, color: 'var(--color-text-primary)', lineHeight: 1 }}>98.5%</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 700 }}>تشغيل مستمر</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* ─── Center Visual Centerpiece: Gauge + Comparative Chart ─── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 420px) 1fr',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        <OverallPerformanceCard percentage={overall} />
        <PerformanceChart departments={departments} />
      </div>

      {/* ─── Departments Section ─── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
            الوحدات والأقسام الصناعية
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
            اضغط على بطاقة أي قسم للوصول إلى لوحة المتابعة التفصيلية، إدخال المؤشرات، وإدارة العمليات.
          </p>
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          fontSize: '0.8125rem',
          fontWeight: 700,
          color: 'var(--color-text-secondary)',
          background: 'var(--glass-bg-subtle)',
          padding: '0.375rem 0.875rem',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--color-border)'
        }}>
          <span>5 أقسام تشغيلية</span>
        </div>
      </div>

      <DepartmentGrid departments={departments} />
    </PageContainer>
  );
}
