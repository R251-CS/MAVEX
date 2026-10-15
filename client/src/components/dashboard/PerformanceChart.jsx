import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { BarChart3, Sparkles } from 'lucide-react';

export const PerformanceChart = ({ departments = [] }) => {
  // Sort departments by performance percentage descending
  const sortedDepts = [...departments].sort(
    (a, b) => (Number(b.performancePercentage) || 0) - (Number(a.performancePercentage) || 0)
  );

  return (
    <GlassCard glow="purple" style={{ padding: '1.75rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'var(--color-violet-bg)',
            color: 'var(--color-violet)',
            padding: '0.5rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex'
          }}>
            <BarChart3 size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
              مقارنة وتصنيف أداء الأقسام
            </h3>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
              ترتيب الوحدات التشغيلية وفق معدلات الإنجاز لشهر المتابعة
            </span>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--color-violet)',
          background: 'var(--color-violet-bg)',
          border: '1px solid rgba(124, 58, 237, 0.2)',
          padding: '0.25rem 0.625rem',
          borderRadius: 'var(--radius-full)'
        }}>
          <Sparkles size={13} />
          <span>تحديث فوري</span>
        </div>
      </div>

      {/* Chart Rows Container */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        gap: '0.75rem'
      }}>
        {sortedDepts.map((dept, index) => {
          const val = Number(dept.performancePercentage) || 0;

          const getBarColor = () => {
            if (val >= 90) return 'var(--color-success)';
            if (val >= 80) return 'var(--color-primary)';
            if (val >= 70) return 'var(--color-cyan)';
            if (val >= 50) return 'var(--color-warning)';
            return 'var(--color-danger)';
          };

          return (
            <div key={dept.departmentId} style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <span style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: index < 3 ? 'var(--color-primary-bg)' : 'var(--glass-bg-subtle)',
                    color: index < 3 ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {index + 1}
                  </span>
                  <span style={{ color: 'var(--color-text-primary)', fontWeight: 700 }}>
                    {dept.name}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    ({dept.managerName})
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span style={{
                    fontSize: '0.9375rem',
                    fontWeight: 800,
                    color: getBarColor()
                  }}>
                    {val}%
                  </span>
                </div>
              </div>

              {/* Clean Progress Bar Track (No neon drop-shadow or blur) */}
              <div style={{
                width: '100%',
                height: '6px',
                background: 'var(--color-border)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${val}%`,
                  height: '100%',
                  background: getBarColor(),
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};
