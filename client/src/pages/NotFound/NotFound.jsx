import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer, GlassCard, Button } from '../../components/common';
import { SearchX, Home } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <GlassCard glow="blue" style={{ textAlign: 'center', padding: '3.5rem 2rem', maxWidth: '480px', width: '100%' }}>
          <div style={{
            display: 'inline-flex',
            padding: '1rem',
            borderRadius: '50%',
            background: 'rgba(59, 130, 246, 0.1)',
            color: 'var(--accent-blue)',
            marginBottom: '1.25rem'
          }}>
            <SearchX size={48} />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>404</h1>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>الصفحة غير موجودة</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem', fontSize: '0.9375rem', lineHeight: 1.6 }}>
            الصفحة التي تحاول الوصول إليها غير متوفرة أو قد تم نقلها.
          </p>
          <Button
            variant="primary"
            icon={Home}
            onClick={() => navigate('/')}
            style={{ margin: '0 auto' }}
          >
            العودة للوحة التحكم
          </Button>
        </GlassCard>
      </div>
    </PageContainer>
  );
}
