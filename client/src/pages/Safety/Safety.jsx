import React, { useState } from 'react';
import { useMonth } from '../../context/MonthContext';
import { PageContainer, PageHeader, GlassCard, Button, StatusBadge, DataTable } from '../../components/common';
import { DepartmentSummary } from '../../components/departments/DepartmentSummary';
import { KpiPanel } from '../../components/departments/KpiPanel';
import { ShieldCheck, ShieldAlert, Award, FileCheck, Plus } from 'lucide-react';
import { useToast } from '../../components/common/Toast';

export default function Safety() {
  const { selectedMonth } = useMonth();
  const { addToast } = useToast();
  const [managerName, setManagerName] = useState('أ. محمود فوزي');

  const [kpis, setKpis] = useState({
    ppe: 96,
    audits: 92,
    emergency: 95
  });

  const [safetyAudits] = useState([
    { id: 'sa-1', area: 'عنبر التشكيل والقص', item: 'ارتداء واقيات العين والأذن ومهمات الوقاية', result: 'compliant', date: '2026-10-12' },
    { id: 'sa-2', area: 'منطقة كبائن الدهان', item: 'جاهزية خراطيم الإطفاء وتهوية الكبائن', result: 'compliant', date: '2026-10-10' },
    { id: 'sa-3', area: 'ممرات التخزين وحركة الرافعات', item: 'خلو الممرات من العوائق ووضوح خطوط السير', result: 'compliant', date: '2026-10-07' }
  ]);

  const handleKpiChange = (key, value) => {
    setKpis((prev) => ({ ...prev, [key]: value }));
  };

  const columns = [
    {
      header: 'منطقة التفتيش / العنبر',
      accessor: 'area',
      render: (r) => <strong style={{ color: 'var(--color-text-primary)' }}>{r.area}</strong>
    },
    {
      header: 'بند السلامة والتدقيق',
      accessor: 'item',
      render: (r) => <span style={{ color: 'var(--color-text-secondary)' }}>{r.item}</span>
    },
    {
      header: 'تاريخ الجولة',
      accessor: 'date',
      render: (r) => <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>{r.date}</span>
    },
    {
      header: 'النتيجة',
      accessor: 'result',
      width: '130px',
      render: (r) => (
        <StatusBadge status={r.result === 'compliant' ? 'success' : 'warning'} size="sm">
          {r.result === 'compliant' ? 'مطابق للشروط' : 'يحتاج معالجة'}
        </StatusBadge>
      )
    }
  ];

  return (
    <PageContainer>
      <PageHeader
        title="السلامة والصحة المهنية (Safety & HSE)"
        description="متابعة الالتزام باشتراطات السلامة المهنية، بيئة العمل الآمنة، وجولات التفتيش الوقائي."
        actions={
          <Button variant="primary" icon={Plus} size="sm" onClick={() => addToast('نموذج جولة التفتيش قيد التجهيز', 'info')}>
            تسجيل جولة سلامة
          </Button>
        }
      />

      <DepartmentSummary
        departmentTitle="إدارة السلامة والصحة المهنية والبيئة"
        selectedMonth={selectedMonth}
        managerName={managerName}
        onManagerNameChange={setManagerName}
        accentColor="green"
      />

      {/* Highlights */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <GlassCard style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ color: 'var(--color-success)', background: 'var(--color-success-bg)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <Award size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>أيام عمل بلا حوادث</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-success)' }}>142 يوم</div>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ color: 'var(--color-primary)', background: 'var(--color-primary-bg)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <FileCheck size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>الجولات التفتيشية</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>12 جولة منجزة</div>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ color: 'var(--color-cyan)', background: 'var(--color-cyan-bg)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>معدل التوافق مع المعايير</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>96% (امتياز)</div>
          </div>
        </GlassCard>
      </div>

      <KpiPanel
        accentColor="green"
        kpis={[
          { key: 'ppe', label: 'نسبة الالتزام بمهمات الوقاية الشخصية (PPE)', value: kpis.ppe, color: 'green' },
          { key: 'audits', label: 'دقة وتغطية جولات الفحص الدوري لبيئة العمل', value: kpis.audits, color: 'blue' },
          { key: 'emergency', label: 'جاهزية أنظمة الإطفاء والإخلاء والطوارئ', value: kpis.emergency, color: 'purple' }
        ]}
        onKpiChange={handleKpiChange}
      />

      {/* Safety Logs */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
            سجل الجولات التفتيشية للسلامة المهنية
          </h3>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
            تقارير التدقيق الميداني على بيئة العمل واشتراطات الأمان الصناعي
          </span>
        </div>

        <GlassCard style={{ padding: '0.5rem', overflow: 'hidden' }}>
          <DataTable columns={columns} data={safetyAudits} />
        </GlassCard>
      </div>
    </PageContainer>
  );
}
