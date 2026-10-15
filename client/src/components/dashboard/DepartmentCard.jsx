import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../common/GlassCard';
import { ArrowLeft, User } from 'lucide-react';

export const DepartmentCard = ({
  departmentId,
  name,
  managerName = 'غير محدد',
  performancePercentage = 0,
  route,
  icon: Icon,
  color = 'blue'
}) => {
  const navigate = useNavigate();
  const percentage = Number(performancePercentage) || 0;

  const colorMap = {
    blue: { main: 'var(--color-primary)', bg: 'var(--color-primary-bg)', border: 'var(--color-primary-border)' },
    cyan: { main: 'var(--color-cyan)', bg: 'var(--color-cyan-bg)', border: 'rgba(2, 132, 199, 0.25)' },
    purple: { main: 'var(--color-violet)', bg: 'var(--color-violet-bg)', border: 'rgba(124, 58, 237, 0.25)' },
    green: { main: 'var(--color-success)', bg: 'var(--color-success-bg)', border: 'var(--color-success-border)' },
    amber: { main: 'var(--color-warning)', bg: 'var(--color-warning-bg)', border: 'var(--color-warning-border)' },
    red: { main: 'var(--color-danger)', bg: 'var(--color-danger-bg)', border: 'var(--color-danger-border)' }
  };

  const currentTheme = colorMap[color] || colorMap.blue;

  return (
    <GlassCard
      interactive
      hoverEffect
      glow={color}
      onClick={() => route && navigate(route)}
      className="mx-dept-card"
      style={{
        padding: '1.5rem',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        minHeight: '210px'
      }}
    >
      <div>
        {/* Top Icon & Metric Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-md)',
            background: currentTheme.bg,
            border: `1px solid ${currentTheme.border}`,
            color: currentTheme.main,
            transition: 'transform var(--transition-fast)'
          }}>
            {Icon && <Icon size={22} />}
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
            <span style={{
              fontSize: '1.75rem',
              fontWeight: 900,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1
            }}>
              {percentage}
            </span>
            <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: currentTheme.main }}>
              %
            </span>
          </div>
        </div>

        {/* Title & Manager */}
        <h3 style={{
          fontSize: '1.0625rem',
          fontWeight: 800,
          color: 'var(--color-text-primary)',
          marginBottom: '0.375rem',
          lineHeight: 1.3
        }}>
          {name}
        </h3>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem',
          fontSize: '0.8125rem',
          color: 'var(--color-text-secondary)'
        }}>
          <User size={13} style={{ color: 'var(--color-text-muted)' }} />
          <span>المسؤول: {managerName}</span>
        </div>
      </div>

      {/* Clean Progress & Navigation Link */}
      <div style={{ marginTop: '1.5rem' }}>
        <div style={{
          width: '100%',
          height: '6px',
          background: 'var(--color-border)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          marginBottom: '1rem'
        }}>
          <div style={{
            width: `${percentage}%`,
            height: '100%',
            background: currentTheme.main,
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          }} />
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8125rem',
          fontWeight: 700,
          color: currentTheme.main
        }}>
          <span>الدخول لإدارة القسم</span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            background: currentTheme.bg
          }}>
            <ArrowLeft size={13} />
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
