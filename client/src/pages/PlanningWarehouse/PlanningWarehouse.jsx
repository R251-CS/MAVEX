import React, { useState } from 'react';
import { useMonth } from '../../context/MonthContext';
import { PageContainer, PageHeader, GlassCard, Button, StatusBadge, DataTable } from '../../components/common';
import { DepartmentSummary } from '../../components/departments/DepartmentSummary';
import { KpiPanel } from '../../components/departments/KpiPanel';
import { Boxes, PackageCheck, Truck, Clock, Plus } from 'lucide-react';
import { useToast } from '../../components/common/Toast';

export default function PlanningWarehouse() {
  const { selectedMonth } = useMonth();
  const { addToast } = useToast();
  const [managerName, setManagerName] = useState('أ. خالد السيد');

  const [kpis, setKpis] = useState({
    planning: 85,
    stock: 94,
    turnaround: 88
  });

  const [shipments] = useState([
    { id: 'sh-1', code: 'PO-2026-88', item: 'ألواح صاج مجلفن 2 مم', qty: '45 طن', status: 'delivered', date: '2026-10-12' },
    { id: 'sh-2', code: 'PO-2026-91', item: 'مسامير ولوازم تثبيت هيكلي', qty: '12,000 قطعة', status: 'transit', date: '2026-10-14' },
    { id: 'sh-3', code: 'PO-2026-94', item: 'دهانات إلكتروستاتيك بودرة', qty: '800 كجم', status: 'delivered', date: '2026-10-09' }
  ]);

  const handleKpiChange = (key, value) => {
    setKpis((prev) => ({ ...prev, [key]: value }));
  };

  const columns = [
    {
      header: 'رقم الإذن',
      accessor: 'code',
      width: '130px',
      render: (r) => <strong style={{ color: 'var(--color-primary)' }}>{r.code}</strong>
    },
    {
      header: 'الصنف / المادة الخام',
      accessor: 'item',
      render: (r) => <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{r.item}</span>
    },
    {
      header: 'الكمية المستلمة',
      accessor: 'qty',
      render: (r) => <span style={{ color: 'var(--color-text-secondary)' }}>{r.qty}</span>
    },
    {
      header: 'تاريخ الورود',
      accessor: 'date',
      render: (r) => <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>{r.date}</span>
    },
    {
      header: 'حالة الاستلام',
      accessor: 'status',
      width: '140px',
      render: (r) => (
        <StatusBadge status={r.status === 'delivered' ? 'success' : 'warning'} size="sm">
          {r.status === 'delivered' ? 'تم الاستلام والفحص' : 'قيد الشحن والتوريد'}
        </StatusBadge>
      )
    }
  ];

  return (
    <PageContainer>
      <PageHeader
        title="التخطيط والمستودعات (Planning & Warehouse)"
        description="إدارة خطط التوريد، مراقبة مستويات المخزون، صرف المواد الخام، ومتابعة سلاسل الإمداد."
        actions={
          <Button variant="primary" icon={Plus} size="sm" onClick={() => addToast('نموذج إذن الصرف قيد التجهيز', 'info')}>
            إذن صرف مخزني
          </Button>
        }
      />

      <DepartmentSummary
        departmentTitle="إدارة التخطيط ومستودعات المواد الخام"
        selectedMonth={selectedMonth}
        managerName={managerName}
        onManagerNameChange={setManagerName}
        accentColor="purple"
      />

      {/* Quick Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <GlassCard style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ color: 'var(--color-violet)', background: 'var(--color-violet-bg)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <Boxes size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>مستوى كفاية المخزون</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>94% (آمن)</div>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ color: 'var(--color-cyan)', background: 'var(--color-cyan-bg)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <Truck size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>إجمالي أذونات الصرف</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>54 إذن صرف</div>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ color: 'var(--color-success)', background: 'var(--color-success-bg)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <Clock size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>متوسط زمن الاستجابة</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>3 ساعات</div>
          </div>
        </GlassCard>
      </div>

      <KpiPanel
        accentColor="purple"
        kpis={[
          { key: 'planning', label: 'دقة وتوافق خطط الإنتاج المعتمدة', value: kpis.planning, color: 'purple' },
          { key: 'stock', label: 'معدل توافر المواد الخام الاستراتيجية', value: kpis.stock, color: 'blue' },
          { key: 'turnaround', label: 'سرعة وكفاءة الصرف لخطوط التشغيل', value: kpis.turnaround, color: 'green' }
        ]}
        onKpiChange={handleKpiChange}
      />

      {/* Shipments Log */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
            أحدث حركات التوريد والاستلام المخزني
          </h3>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
            متابعة استلام دفعات المواد الخام والقطع المغذية لخطوط الإنتاج
          </span>
        </div>

        <GlassCard style={{ padding: '0.5rem', overflow: 'hidden' }}>
          <DataTable columns={columns} data={shipments} />
        </GlassCard>
      </div>
    </PageContainer>
  );
}
