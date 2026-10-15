import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { TextField } from '../common/TextField';
import { User, Calendar, CheckCircle } from 'lucide-react';

export const DepartmentSummary = ({
  departmentTitle,
  selectedMonth,
  managerName,
  onManagerNameChange,
  accentColor = 'blue'
}) => {
  const colorMap = {
    blue: { main: 'var(--color-primary)', bg: 'var(--color-primary-bg)', border: 'var(--color-primary-border)', glow: 'var(--shadow-glow-primary)' },
    cyan: { main: 'var(--color-cyan)', bg: 'var(--color-cyan-bg)', border: 'rgba(6, 182, 212, 0.3)', glow: 'var(--shadow-glow-cyan)' },
    purple: { main: 'var(--color-violet)', bg: 'var(--color-violet-bg)', border: 'rgba(139, 92, 246, 0.3)', glow: 'var(--shadow-glow-purple)' },
    green: { main: 'var(--color-success)', bg: 'var(--color-success-bg)', border: 'var(--color-success-border)', glow: 'var(--shadow-glow-success)' },
    amber: { main: 'var(--color-warning)', bg: 'var(--color-warning-bg)', border: 'var(--color-warning-border)', glow: '0 0 20px rgba(245, 158, 11, 0.35)' },
    red: { main: 'var(--color-danger)', bg: 'var(--color-danger-bg)', border: 'var(--color-danger-border)', glow: '0 0 20px rgba(239, 68, 68, 0.35)' }
  };

  const theme = colorMap[accentColor] || colorMap.blue;

  return (
    <GlassCard glow={accentColor} style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: theme.bg,
            border: `1px solid ${theme.border}`,
            color: theme.main,
            padding: '0.75rem',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            boxShadow: theme.glow
          }}>
            <User size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
                {departmentTitle}
              </h2>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.6875rem',
                fontWeight: 700,
                color: theme.main,
                background: theme.bg,
                padding: '0.125rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                border: `1px solid ${theme.border}`
              }}>
                <CheckCircle size={10} />
                قسم نشط
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--color-text-secondary)', fontSize: '0.8125rem', marginTop: '0.375rem' }}>
              <Calendar size={14} style={{ color: 'var(--color-text-muted)' }} />
              <span>فترة المتابعة والتدقيق: <strong>{selectedMonth}</strong></span>
            </div>
          </div>
        </div>

        <div style={{ minWidth: '280px' }}>
          <TextField
            label="المسؤول عن إدارة القسم"
            value={managerName}
            onChange={(e) => onManagerNameChange && onManagerNameChange(e.target.value)}
            placeholder="اكتب اسم المسؤول..."
          />
        </div>
      </div>
    </GlassCard>
  );
};
