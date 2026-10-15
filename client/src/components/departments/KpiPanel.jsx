import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { KpiSlider } from '../common/KpiSlider';
import { Sliders } from 'lucide-react';

export const KpiPanel = ({
  title = 'مؤشرات الأداء الرئيسية (KPIs)',
  kpis = [],
  onKpiChange,
  accentColor = 'blue'
}) => {
  return (
    <GlassCard glow={accentColor} style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
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
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {kpis.map((kpi) => (
          <KpiSlider
            key={kpi.key}
            label={kpi.label}
            value={kpi.value}
            onChange={(val) => onKpiChange && onKpiChange(kpi.key, val)}
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
