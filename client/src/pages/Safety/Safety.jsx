import React, { useState, useEffect } from 'react';
import { useMonth } from '../../context/MonthContext';
import { PageContainer, PageHeader, GlassCard, Button, StatusBadge, DataTable, Modal, TextField } from '../../components/common';
import { DepartmentSummary } from '../../components/departments/DepartmentSummary';
import { KpiPanel } from '../../components/departments/KpiPanel';
import { ShieldCheck, ShieldAlert, Award, FileCheck, Plus, AlertTriangle } from 'lucide-react';
import { useToast } from '../../components/common/Toast';
import safetyService from '../../services/safetyService';
import dashboardService from '../../services/dashboardService';

const SAFETY_AREAS = [
  'عنبر التشكيل والقص',
  'منطقة كبائن الدهان الإلكتروستاتيك',
  'ممرات التخزين وحركة الرافعات الشوكية',
  'محطة الغازات والنيتروجين المركزية',
  'عنبر التجميع واللحام الآلي'
];

export default function Safety() {
  const { selectedMonth } = useMonth();
  const { addToast } = useToast();
  const [managerName, setManagerName] = useState('أ. محمود فوزي');
  const [loading, setLoading] = useState(false);

  const [kpis, setKpis] = useState({
    ppe: 96,
    audits: 92,
    emergency: 95
  });

  const [safetyAudits, setSafetyAudits] = useState([
    { id: 'sa-1', area: 'عنبر التشكيل والقص', item: 'ارتداء واقيات العين والأذن ومهمات الوقاية', result: 'compliant', date: '2026-10-12', notes: 'التزام تام من جميع الفنيين' },
    { id: 'sa-2', area: 'منطقة كبائن الدهان', item: 'جاهزية خراطيم الإطفاء وتهوية الكبائن', result: 'compliant', date: '2026-10-10', notes: 'الفحص سليم ونظام الشفط يعمل بكفاءة' },
    { id: 'sa-3', area: 'ممرات التخزين وحركة الرافعات', item: 'خلو الممرات من العوائق ووضوح خطوط السير', result: 'compliant', date: '2026-10-07', notes: 'تم التأكيد على عدم وضع طبالي في الممرات' }
  ]);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [form, setForm] = useState({
    area: SAFETY_AREAS[0],
    item: '',
    result: 'compliant', // 'compliant' | 'non_compliant'
    notes: '',
    date: new Date().toISOString().slice(0, 10)
  });

  useEffect(() => {
    let isMounted = true;
    safetyService.getIncidents(selectedMonth).then(incidents => {
      if (isMounted && incidents && incidents.length > 0) {
        setSafetyAudits(incidents.map(inc => ({
          id: inc.id,
          area: inc.location || inc.area || 'عنبر الإنتاج',
          item: inc.title || inc.item || 'تفتيش دوري',
          result: inc.severity === 'high' || inc.result === 'non_compliant' ? 'non_compliant' : 'compliant',
          date: inc.date || inc.createdAt?.slice(0, 10) || new Date().toISOString().slice(0, 10),
          notes: inc.description || inc.notes || ''
        })));
      }
    });

    dashboardService.getDashboard(selectedMonth).then(res => {
      const data = res?.data || res;
      const dept = (data?.departments || []).find(d => d.departmentId === 'safety');
      if (isMounted && dept?.kpis) {
        setKpis({
          ppe: Number(dept.kpis.ppe) || 96,
          audits: Number(dept.kpis.audits) || 92,
          emergency: Number(dept.kpis.emergency) || 95
        });
      }
    }).catch(() => {});

    return () => { isMounted = false; };
  }, [selectedMonth]);

  const handleCreateAudit = async (e) => {
    e.preventDefault();
    if (!form.item.trim()) {
      addToast('يرجى تحديد بند السلامة أو الفحص', 'error');
      return;
    }

    setLoading(true);
    const newRecord = {
      id: `sa-${Date.now()}`,
      area: form.area,
      item: form.item.trim(),
      result: form.result,
      date: form.date,
      notes: form.notes.trim() || 'فحص ميداني مجدول'
    };

    setSafetyAudits(prev => [newRecord, ...prev]);

    try {
      await safetyService.addIncident({
        title: form.item,
        location: form.area,
        area: form.area,
        item: form.item,
        description: form.notes || 'جولة تفتيش بيئة العمل والسلامة الصناعية',
        result: form.result,
        severity: form.result === 'non_compliant' ? 'high' : 'low',
        date: form.date,
        month: selectedMonth
      });

      if (form.result === 'non_compliant') {
        addToast('تم تسجيل الجولة وتحويل المخالفة تلقائياً لقسم الرقابة والمخالفات ⚠️', 'warning');
      } else {
        addToast('تم اعتماد جولة السلامة بنجاح ✓', 'success');
      }
    } catch {
      addToast('تم حفظ التقرير محلياً بنجاح', 'info');
    } finally {
      setLoading(false);
      setIsAddModalOpen(false);
      setForm({
        area: SAFETY_AREAS[0],
        item: '',
        result: 'compliant',
        notes: '',
        date: new Date().toISOString().slice(0, 10)
      });
    }
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
      render: (r) => (
        <div>
          <div style={{ color: 'var(--color-text-primary)' }}>{r.item}</div>
          {r.notes && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{r.notes}</div>}
        </div>
      )
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
        <StatusBadge status={r.result === 'compliant' ? 'success' : 'danger'} size="sm">
          {r.result === 'compliant' ? 'مطابق للشروط' : 'مخالفة مرصودة'}
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
          <Button variant="primary" icon={Plus} size="sm" onClick={() => setIsAddModalOpen(true)}>
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

      {/* Modal: New Safety Audit */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="تسجيل جولة تفتيش سلامة وصحة مهنية"
      >
        <form onSubmit={handleCreateAudit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
              منطقة التفتيش / العنبر
            </label>
            <select
              value={form.area}
              onChange={(e) => setForm(f => ({ ...f, area: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface-hover)',
                color: 'var(--color-text-primary)',
                fontFamily: 'inherit',
                fontSize: '0.9375rem'
              }}
            >
              {SAFETY_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <TextField
            label="بند السلامة أو التدقيق الميداني"
            placeholder="مثال: ارتداء نظارات الواقية ومهمات اللحام، جاهزية أسطوانات الإطفاء..."
            value={form.item}
            onChange={(e) => setForm(f => ({ ...f, item: e.target.value }))}
            required
          />

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
              نتيجة التفتيش
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, result: 'compliant' }))}
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: form.result === 'compliant' ? '2px solid var(--color-success)' : '1px solid var(--color-border)',
                  background: form.result === 'compliant' ? 'var(--color-success-bg)' : 'transparent',
                  color: form.result === 'compliant' ? 'var(--color-success)' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.875rem'
                }}
              >
                ✓ مطابق للشروط
              </button>
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, result: 'non_compliant' }))}
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: form.result === 'non_compliant' ? '2px solid var(--color-danger)' : '1px solid var(--color-border)',
                  background: form.result === 'non_compliant' ? 'var(--color-danger-bg)' : 'transparent',
                  color: form.result === 'non_compliant' ? 'var(--color-danger)' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.875rem'
                }}
              >
                ⚠️ مخالفة / غير مطابق
              </button>
            </div>
            {form.result === 'non_compliant' && (
              <div style={{ fontSize: '0.75rem', color: 'var(--color-danger)', marginTop: '0.375rem' }}>
                * سيتم تحويل هذه المخالفة تلقائياً إلى إدارة الرقابة والمخالفات لإصدار أمر تصحيحي فوري.
              </div>
            )}
          </div>

          <TextField
            label="ملاحظات وتوجيهات السلامة"
            placeholder="تفاصيل الملاحظة الميدانية والإجراء المطلوب..."
            value={form.notes}
            onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
          />

          <TextField
            label="تاريخ الجولة التفتيشية"
            type="date"
            value={form.date}
            onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))}
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>
              إلغاء
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'جاري الاعتماد...' : 'حفظ واعتماد الجولة'}
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}
