import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { IconButton } from '../common/IconButton';
import { StatusBadge } from '../common/StatusBadge';
import { Trash2, User, Wallet, ChevronDown, ChevronUp, DollarSign } from 'lucide-react';

export const TeamMemberCard = ({
  member,
  onDelete,
  roleLabel = 'فني تشغيل',
  accentColor = 'blue'
}) => {
  const [showSalary, setShowSalary] = useState(false);
  const hasErrors = Number(member.errors) > 0;
  const basicSalary = member.basicSalary || 5500;
  const incentives = member.incentives || 1200;
  const deductions = member.deductions || 0;
  const netSalary = member.netSalary || (basicSalary + incentives - deductions);

  return (
    <GlassCard hoverEffect style={{ padding: '1.25rem', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
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

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        <StatusBadge status={hasErrors ? 'error' : 'success'} size="sm">
          {hasErrors ? `${member.errors} أخطاء مسجلة` : 'سجل خالي من الأخطاء'}
        </StatusBadge>

        {member.machine && (
          <StatusBadge status="neutral" size="sm">
            الماكينة: {member.machine}
          </StatusBadge>
        )}
      </div>

      {/* Salary & Incentives Section (FR-17, FR-18) */}
      <div style={{
        marginTop: '0.5rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: '0.8125rem'
      }}>
        <button
          type="button"
          onClick={() => setShowSalary(!showSalary)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'none',
            border: 'none',
            color: 'var(--accent-blue)',
            cursor: 'pointer',
            padding: '0.25rem 0',
            fontWeight: 600,
            fontSize: '0.75rem'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Wallet size={14} /> تفاصيل الراتب والحوافز
          </span>
          {showSalary ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showSalary && (
          <div style={{
            marginTop: '0.5rem',
            padding: '0.625rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 255, 255, 0.02)',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.4rem',
            fontSize: '0.75rem'
          }}>
            <div>
              <span style={{ color: 'var(--color-text-muted)' }}>الراتب الأساسي:</span>
              <div style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{basicSalary.toLocaleString()} ج.م</div>
            </div>
            <div>
              <span style={{ color: 'var(--color-text-muted)' }}>الحوافز والمكافآت:</span>
              <div style={{ fontWeight: 700, color: 'var(--color-success)' }}>+{incentives.toLocaleString()} ج.م</div>
            </div>
            {deductions > 0 && (
              <div>
                <span style={{ color: 'var(--color-text-muted)' }}>الاستقطاعات:</span>
                <div style={{ fontWeight: 700, color: 'var(--accent-red)' }}>-{deductions.toLocaleString()} ج.م</div>
              </div>
            )}
            <div style={{ gridColumn: 'span 2', paddingTop: '0.25rem', borderTop: '1px dashed var(--border-subtle)' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>صافي الراتب المستحق:</span>
              <div style={{ fontWeight: 800, color: 'var(--accent-blue)', fontSize: '0.875rem' }}>
                {netSalary.toLocaleString()} ج.م
              </div>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
};
