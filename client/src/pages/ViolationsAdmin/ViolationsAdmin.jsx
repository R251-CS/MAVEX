import React, { useState } from 'react';
import { useMonth } from '../../context/MonthContext';
import { PageContainer, PageHeader, GlassCard, Button, StatusBadge, DataTable } from '../../components/common';
import { DepartmentSummary } from '../../components/departments/DepartmentSummary';
import { KpiPanel } from '../../components/departments/KpiPanel';
import { AlertOctagon, ShieldAlert, CheckCircle, Clock, Plus } from 'lucide-react';
import { useToast } from '../../components/common/Toast';

export default function ViolationsAdmin() {
  const { selectedMonth } = useMonth();
  const { addToast } = useToast();
  const [managerName, setManagerName] = useState('أ. علاء إبراهيم');

  const [kpis, setKpis] = useState({
    resolution: 82,
    prevention: 75,
    compliance: 88
  });

  const [violations] = useState([
    { id: 'v-1', code: 'V-102', dept: 'الإنتاج', description: 'عدم ارتداء النظارة الواقية أثناء عمليات التجليخ', action: 'تنبيه إداري وتوفير مهمة وقاية بديلة', status: 'closed', date: '2026-10-09' },
    { id: 'v-2', code: 'V-103', dept: 'المستودعات', description: 'تأخير في تسجيل أذون الاستلام على النظام الإلكتروني', action: 'تدريب تنشيطي على الإدخال الفوري', status: 'closed', date: '2026-10-11' },
    { id: 'v-3', code: 'V-104', dept: 'المكتب الفني', description: 'تعديل مقاسات دون اعتماد مهندس الجودة', action: 'إعادة مراجعة المخطط وسحب النسخة القديمة', status: 'pending', date: '2026-10-14' }
  ]);

  const handleKpiChange = (key, value) => {
    setKpis((prev) => ({ ...prev, [key]: value }));
  };

  const columns = [
    {
      header: 'كود المخالفة',
      accessor: 'code',
      width: '120px',
      render: (r) => <strong style={{ color: 'var(--color-danger)' }}>{r.code}</strong>
    },
    {
      header: 'القسم المعني',
      accessor: 'dept',
      width: '130px',
      render: (r) => <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{r.dept}</span>
    },
    {
      header: 'وصف المخالفة المرصودة',
      accessor: 'description',
      render: (r) => <span style={{ color: 'var(--color-text-primary)' }}>{r.description}</span>
    },
    {
      header: 'الإجراء التصحيحي المتخذ',
      accessor: 'action',
      render: (r) => <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8125rem' }}>{r.action}</span>
    },
    {
      header: 'الحالة',
      accessor: 'status',
      width: '130px',
      render: (r) => (
        <StatusBadge status={r.status === 'closed' ? 'success' : 'warning'} size="sm">
          {r.status === 'closed' ? 'تمت المعالجة' : 'قيد المتابعة'}
        </StatusBadge>
      )
    }
  ];

  return (
    <PageContainer>
      <PageHeader
        title="إدارة المخالفات والرقابة (Violations Administration)"
        description="رصد مخالفات الجودة والسلامة واللوائح الداخلية ومتابعة إجراءات التصحيح والالتزام."
        actions={
          <Button variant="primary" icon={Plus} size="sm" onClick={() => addToast('نموذج تسجيل المخالفة قيد التجهيز', 'info')}>
            تسجيل مخالفة
          </Button>
        }
      />

      <DepartmentSummary
        departmentTitle="إدارة الرقابة الإدارية والمخالفات"
        selectedMonth={selectedMonth}
        managerName={managerName}
        onManagerNameChange={setManagerName}
        accentColor="red"
      />

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <GlassCard style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ color: 'var(--color-danger)', background: 'var(--color-danger-bg)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <AlertOctagon size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>المخالفات المسجلة</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>3 حالات</div>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ color: 'var(--color-success)', background: 'var(--color-success-bg)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <CheckCircle size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>نسبة معالجة الحالات</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-success)' }}>82%</div>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ color: 'var(--color-primary)', background: 'var(--color-primary-bg)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <Clock size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>متوسط وقت الإغلاق</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>24 ساعة</div>
          </div>
        </GlassCard>
      </div>

      <KpiPanel
        accentColor="red"
        kpis={[
          { key: 'resolution', label: 'سرعة وكفاءة معالجة المخالفات وإغلاقها', value: kpis.resolution, color: 'green' },
          { key: 'prevention', label: 'فاعلية الإجراءات التصحيحية ومنع التكرار', value: kpis.prevention, color: 'amber' },
          { key: 'compliance', label: 'نسبة الامتثال للائحة التنظيمية للمصنع', value: kpis.compliance, color: 'blue' }
        ]}
        onKpiChange={handleKpiChange}
      />

      {/* Violations Log */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
            سجل المخالفات والإجراءات التصحيحية
          </h3>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
            متابعة دقيقة لكل حالة تم رصدها والإجراء الإداري والتنظيمي المتخذ حيالها
          </span>
        </div>

        <GlassCard style={{ padding: '0.5rem', overflow: 'hidden' }}>
          <DataTable columns={columns} data={violations} />
        </GlassCard>
      </div>
    </PageContainer>
  );
}
