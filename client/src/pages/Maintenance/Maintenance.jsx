import React, { useState } from 'react';
import { useMonth } from '../../context/MonthContext';
import { PageContainer, PageHeader, GlassCard, Button, StatusBadge, DataTable } from '../../components/common';
import { DepartmentSummary } from '../../components/departments/DepartmentSummary';
import { KpiPanel } from '../../components/departments/KpiPanel';
import { Wrench, Zap, CheckCircle2, AlertTriangle, Plus, Activity } from 'lucide-react';
import { useToast } from '../../components/common/Toast';

export default function Maintenance() {
  const { selectedMonth } = useMonth();
  const { addToast } = useToast();
  const [managerName, setManagerName] = useState('م. ياسر عبد الله');

  const [kpis, setKpis] = useState({
    uptime: 98.5,
    preventive: 92,
    mttr: 89
  });

  const [workOrders] = useState([
    { id: 'wo-1', machine: 'ثناية هيدروليكية 1', task: 'استبدال زيت الهيدروليك وفلاتر الضغط', type: 'وقائية', status: 'completed', date: '2026-10-11' },
    { id: 'wo-2', machine: 'مقص ألواح CNC', task: 'فحص ومعايرة حد السكين والشفرات', type: 'دورية', status: 'completed', date: '2026-10-13' },
    { id: 'wo-3', machine: 'روبوت لحام محطة 2', task: 'معايرة ذراع التغذية وتحديث البرنامج', type: 'طارئة', status: 'in_progress', date: '2026-10-15' }
  ]);

  const handleKpiChange = (key, value) => {
    setKpis((prev) => ({ ...prev, [key]: value }));
  };

  const columns = [
    {
      header: 'الماكينة / المعدة',
      accessor: 'machine',
      render: (r) => <strong style={{ color: 'var(--color-text-primary)' }}>{r.machine}</strong>
    },
    {
      header: 'الإجراء / مهمة الصيانة',
      accessor: 'task',
      render: (r) => <span style={{ color: 'var(--color-text-secondary)' }}>{r.task}</span>
    },
    {
      header: 'النوع',
      accessor: 'type',
      width: '110px',
      render: (r) => (
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          color: r.type === 'طارئة' ? 'var(--color-danger)' : 'var(--color-primary)',
          background: r.type === 'طارئة' ? 'var(--color-danger-bg)' : 'var(--color-primary-bg)',
          padding: '0.125rem 0.5rem',
          borderRadius: 'var(--radius-sm)'
        }}>
          {r.type}
        </span>
      )
    },
    {
      header: 'تاريخ الإجراء',
      accessor: 'date',
      render: (r) => <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>{r.date}</span>
    },
    {
      header: 'الحالة',
      accessor: 'status',
      width: '130px',
      render: (r) => (
        <StatusBadge status={r.status === 'completed' ? 'success' : 'warning'} size="sm">
          {r.status === 'completed' ? 'تمت بنجاح' : 'جاري العمل'}
        </StatusBadge>
      )
    }
  ];

  return (
    <PageContainer>
      <PageHeader
        title="الصيانة والتشغيل (Maintenance & Operations)"
        description="متابعة أوامر الصيانة الوقائية والطارئة، جاهزية الماكينات والمعدات الصناعية، وتقليل فترات التوقف."
        actions={
          <Button variant="primary" icon={Plus} size="sm" onClick={() => addToast('نموذج أمر الصيانة قيد التجهيز', 'info')}>
            أمر صيانة جديد
          </Button>
        }
      />

      <DepartmentSummary
        departmentTitle="إدارة الصيانة الهندسية والميكانيكية"
        selectedMonth={selectedMonth}
        managerName={managerName}
        onManagerNameChange={setManagerName}
        accentColor="amber"
      />

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <GlassCard style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ color: 'var(--color-warning)', background: 'var(--color-warning-bg)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <Activity size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>جاهزية خطوط الإنتاج</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>98.5%</div>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ color: 'var(--color-primary)', background: 'var(--color-primary-bg)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <Wrench size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>الماكينات المشمولة بالخطة</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>18 ماكينة</div>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ color: 'var(--color-success)', background: 'var(--color-success-bg)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>أوامر الصيانة المنجزة</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>24 أمر</div>
          </div>
        </GlassCard>
      </div>

      <KpiPanel
        accentColor="amber"
        kpis={[
          { key: 'uptime', label: 'معدل تشغيل الماكينات واستمراريتها (Uptime)', value: kpis.uptime, color: 'green', unit: '%' },
          { key: 'preventive', label: 'نسبة الالتزام بالصيانة الوقائية المجدولة', value: kpis.preventive, color: 'amber', unit: '%' },
          { key: 'mttr', label: 'سرعة الاستجابة وإصلاح الأعطال الطارئة', value: kpis.mttr, color: 'blue', unit: '%' }
        ]}
        onKpiChange={handleKpiChange}
      />

      {/* Work Orders Log */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
            سجل أوامر الصيانة المنفذة والجارية
          </h3>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
            بيان أعمال الصيانة الميكانيكية والكهربائية المنفذة على ماكينات المصنع
          </span>
        </div>

        <GlassCard style={{ padding: '0.5rem', overflow: 'hidden' }}>
          <DataTable columns={columns} data={workOrders} />
        </GlassCard>
      </div>
    </PageContainer>
  );
}
