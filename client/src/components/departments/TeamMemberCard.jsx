import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { IconButton } from '../common/IconButton';
import { StatusBadge } from '../common/StatusBadge';
import { Trash2, User, AlertTriangle, CheckCircle, Cpu } from 'lucide-react';

export const TeamMemberCard = ({
  member,
  onDelete,
  roleLabel = 'مهندس',
  accentColor = 'blue'
}) => {
  const hasErrors = Number(member.errors) > 0;

  return (
    <GlassCard hoverEffect style={{ padding: '1.25rem', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            background: hasErrors ? 'var(--color-danger-bg)' : 'var(--color-primary-bg)',
            border: `1px solid ${hasErrors ? 'var(--color-danger-border)' : 'var(--color-primary-border)'}`,
            color: hasErrors ? 'var(--color-danger)' : 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1rem',
            boxShadow: hasErrors ? '0 0 12px rgba(239, 68, 68, 0.2)' : 'var(--shadow-glow-primary)'
          }}>
            {member.name ? member.name.charAt(0) : <User size={18} />}
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: '0 0 0.125rem' }}>
              {member.name}
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              {roleLabel}
            </span>
          </div>
        </div>

        <IconButton
          icon={Trash2}
          label="حذف"
          variant="danger"
          size="sm"
          onClick={() => onDelete(member.id)}
        />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <StatusBadge status={hasErrors ? 'error' : 'success'} size="sm">
          {hasErrors ? `${member.errors} أخطاء مسجلة` : 'سجل خالي من الأخطاء'}
        </StatusBadge>

        {member.machines !== undefined && (
          <StatusBadge status="neutral" size="sm">
            {member.machines} ماكينات مخصصة
          </StatusBadge>
        )}

        {member.machine && (
          <StatusBadge status="neutral" size="sm">
            الماكينة: {member.machine}
          </StatusBadge>
        )}
      </div>
    </GlassCard>
  );
};
