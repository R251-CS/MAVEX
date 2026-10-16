import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { KpiSlider } from '../common/KpiSlider';
import { Sliders, ShieldCheck } from 'lucide-react';

export const KpiPanel = ({
  title = 'مؤشرات الأداء الرئيسية (KPIs)',
  kpis = [],
  accentColor = 'blue'
}) => {
  return (
    <GlassCard glow={accentColor} style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            background: `rgba(var(--accent-${accentColor}-rgb, 59, 130, 246), 0.15)`,
            color: `var(--accent-${accentColor})`,
            padding: '0.5rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex'
          }}>
            <Sliders size={18} />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
            {title}
          </h3>
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          padding: '0.25rem 0.625rem',
          borderRadius: 'var(--radius-full)',
          background: 'var(--color-success-bg)',
          border: '1px solid var(--color-success-border)',
          color: 'var(--color-success)',
          fontSize: '0.75rem',
          fontWeight: 700
        }}>
          <ShieldCheck size={14} />
          <span>تُحسب آلياً من السيرفر بناءً على العمليات الحية</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {kpis.map((kpi) => (
          <KpiSlider
            key={kpi.key}
            label={kpi.label}
            value={kpi.value}
            readOnly={true}
            unit={kpi.unit || '%'}
            min={kpi.min || 0}
            max={kpi.max || 100}
            color={kpi.color || accentColor}
          />
        ))}
      </div>
    </GlassCard>
  );
};
