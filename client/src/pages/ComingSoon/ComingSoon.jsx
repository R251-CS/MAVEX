import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';

export default function ComingSoon({ title = 'هذا القسم', icon: Icon = Lock }) {
  const navigate = useNavigate();
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh',
      gap: '1.5rem',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'rgba(99, 102, 241, 0.1)',
        border: '2px solid rgba(99, 102, 241, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-primary)'
      }}>
        <Icon size={36} />
      </div>

      <div>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          color: 'var(--color-text-primary)',
          margin: '0 0 0.5rem'
        }}>
          {title} — غير مفعّل حالياً
        </h2>
        <p style={{
          color: 'var(--color-text-secondary)',
          fontSize: '0.9375rem',
          margin: 0,
          maxWidth: '420px'
        }}>
          تم تعطيل هذا القسم مؤقتاً بقرار إداري. سيتم تفعيله وإتاحته في الإصدار القادم من النظام.
        </p>
      </div>

      <button
        type="button"
        onClick={() => navigate('/')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.625rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          background: 'var(--bg-card)',
          color: 'var(--color-text-primary)',
          fontWeight: 600,
          fontSize: '0.875rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(99,102,241,0.1)';
          e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)';
          e.currentTarget.style.color = 'var(--color-primary)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'var(--bg-card)';
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
          e.currentTarget.style.color = 'var(--color-text-primary)';
        }}
      >
        <ArrowRight size={16} />
        العودة للوحة التحكم
      </button>
    </div>
  );
}
