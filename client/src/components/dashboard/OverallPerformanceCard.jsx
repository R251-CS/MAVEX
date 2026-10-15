import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { Activity, TrendingUp, CheckCircle, Clock, Zap } from 'lucide-react';

export const OverallPerformanceCard = ({ percentage = 76, label = 'الأداء العام للمصنع' }) => {
  const numericVal = Math.min(Math.max(Number(percentage) || 0, 0), 100);

  // SVG Circular Gauge calculations
  const radius = 72;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (numericVal / 100) * circumference;

  const getActiveColor = () => {
    if (numericVal >= 85) return 'var(--color-success)';
    if (numericVal >= 65) return 'var(--color-primary)';
    if (numericVal >= 50) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  return (
    <GlassCard glow="blue" className="mx-overall-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'var(--color-primary-bg)',
            color: 'var(--color-primary)',
            padding: '0.5rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex'
          }}>
            <Activity size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
              {label}
            </h3>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
              مؤشر الكفاءة والإنتاجية التراكمي
            </span>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem',
          fontSize: '0.8125rem',
          fontWeight: 700,
          color: 'var(--color-success)',
          background: 'var(--color-success-bg)',
          border: '1px solid var(--color-success-border)',
          padding: '0.25rem 0.625rem',
          borderRadius: 'var(--radius-full)'
        }}>
          <TrendingUp size={14} />
          <span>+4.2% هذا الشهر</span>
        </div>
      </div>

      {/* Main Gauge Graphic (Clean, sharp, no blur/neon glow) */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '0.75rem 0'
      }}>
        <div style={{ position: 'relative', width: '190px', height: '190px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="190" height="190" viewBox="0 0 190 190" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background Track */}
            <circle
              cx="95"
              cy="95"
              r={radius}
              fill="transparent"
              stroke="var(--color-border)"
              strokeWidth={strokeWidth}
            />

            {/* Active Gauge Fill */}
            <circle
              cx="95"
              cy="95"
              r={radius}
              fill="transparent"
              stroke={getActiveColor()}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            />
          </svg>

          {/* Center Metric Display */}
          <div style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', lineHeight: 1 }}>
              <span style={{
                fontSize: '2.75rem',
                fontWeight: 900,
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.02em'
              }}>
                {numericVal}
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: getActiveColor(), marginInlineStart: '2px' }}>
                %
              </span>
            </div>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--color-text-muted)',
              marginTop: '0.25rem'
            }}>
              المعدل المحقق
            </span>
          </div>
        </div>
      </div>

      {/* Sub-metrics Breakdown Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.75rem',
        marginTop: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--color-border)'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0.5rem',
          background: 'var(--glass-bg-subtle)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)'
        }}>
          <div style={{ color: 'var(--color-cyan)', marginBottom: '0.25rem' }}>
            <Zap size={16} />
          </div>
          <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>الكفاءة</span>
          <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>88%</span>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0.5rem',
          background: 'var(--glass-bg-subtle)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)'
        }}>
          <div style={{ color: 'var(--color-success)', marginBottom: '0.25rem' }}>
            <CheckCircle size={16} />
          </div>
          <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>الجودة</span>
          <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>95%</span>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0.5rem',
          background: 'var(--glass-bg-subtle)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)'
        }}>
          <div style={{ color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
            <Clock size={16} />
          </div>
          <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>الالتزام</span>
          <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>91%</span>
        </div>
      </div>
    </GlassCard>
  );
};
