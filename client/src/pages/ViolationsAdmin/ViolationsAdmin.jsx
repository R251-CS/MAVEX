import React, { useState, useEffect } from 'react';
import { useMonth } from '../../context/MonthContext';
import { PageContainer, PageHeader, GlassCard, Button, StatusBadge, DataTable, Modal, TextField } from '../../components/common';
import { DepartmentSummary } from '../../components/departments/DepartmentSummary';
import { KpiPanel } from '../../components/departments/KpiPanel';
import { AlertOctagon, ShieldAlert, CheckCircle, Clock, Plus, Check } from 'lucide-react';
import { useToast } from '../../components/common/Toast';
import violationsService from '../../services/violationsService';
import dashboardService from '../../services/dashboardService';

const DEPARTMENTS_LIST = [
  'إدارة الإنتاج والتشغيل',
  'مراقبة الجودة والتفتيش',
  'المستودعات والتخطيط',
  'المكتب الفني والتصميم',
  'السلامة والصحة المهنية',
  'الصيانة المركزية'
];

export default function ViolationsAdmin() {
  const { selectedMonth } = useMonth();
  const { addToast } = useToast();
  const [managerName, setManagerName] = useState('أ. علاء إبراهيم');
  const [loading, setLoading] = useState(false);

  const [kpis, setKpis] = useState({
    resolution: 82,
    prevention: 75,
    compliance: 88
  });

  const [violations, setViolations] = useState([
    { id: 'v-1', code: 'V-102', dept: 'إدارة الإنتاج والتشغيل', description: 'عدم ارتداء النظارة الواقية أثناء عمليات التجليخ', action: 'تنبيه إداري وتوفير مهمة وقاية بديلة', status: 'closed', date: '2026-10-09' },
    { id: 'v-2', code: 'V-103', dept: 'المستودعات والتخطيط', description: 'تأخير في تسجيل أذون الاستلام على النظام الإلكتروني', action: 'تدريب تنشيطي على الإدخال الفوري', status: 'closed', date: '2026-10-11' },
    { id: 'v-3', code: 'V-104', dept: 'المكتب الفني والتصميم', description: 'تعديل مقاسات دون اعتماد مهندس الجودة', action: 'إعادة مراجعة المخطط وسحب النسخة القديمة', status: 'pending', date: '2026-10-14' }
  ]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [resolveActionText, setResolveActionText] = useState('');

  const [newViolation, setNewViolation] = useState({
    dept: DEPARTMENTS_LIST[0],
    description: '',
    action: ''
  });

  const fetchViolations = async () => {
    try {
      const liveList = await violationsService.getViolations(selectedMonth);
      if (liveList && liveList.length > 0) {
        setViolations(liveList);
      }
    } catch {
      // fallback to initial state
    }

    try {
      const dashRes = await dashboardService.getDashboard(selectedMonth);
      const data = dashRes?.data || dashRes;
      const dept = (data?.departments || []).find(d => d.departmentId === 'violations');
      if (dept?.kpis) {
        setKpis({
          resolution: Number(dept.kpis.resolution) || 82,
          prevention: Number(dept.kpis.prevention) || 75,
          compliance: Number(dept.kpis.compliance) || 88
        });
      }
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    fetchViolations();
  }, [selectedMonth]);

  const openResolveDialog = (violation) => {
    setSelectedViolation(violation);
    setResolveActionText(violation.action || '');
    setIsResolveModalOpen(true);
  };

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    if (!selectedViolation) return;

    const updatedAction = resolveActionText.trim() || 'تم تنفيذ الإجراء التصحيحي وإغلاق المخالفة';
    const nextStatus = 'closed';

    setViolations(prev => prev.map(v => v.id === selectedViolation.id ? { ...v, status: nextStatus, action: updatedAction } : v));

    try {
      await violationsService.updateViolation(selectedViolation.id, {
        status: nextStatus,
        action: updatedAction
      });
      addToast(`تم إغلاق المخالفة (${selectedViolation.code}) وتوثيق الإجراء بنجاح ✓`, 'success');
    } catch {
      addToast('تم تحديث المخالفة محلياً', 'info');
    } finally {
      setIsResolveModalOpen(false);
      setSelectedViolation(null);
    }
  };

  const handleCreateViolation = async (e) => {
    e.preventDefault();
    if (!newViolation.description.trim()) {
      addToast('يرجى كتابة وصف المخالفة المرصودة', 'error');
      return;
    }

    setLoading(true);
    // Immutable System-Generated Serial Code
    const autoCode = `V-${Math.floor(100 + Math.random() * 900)}`;
    const createdItem = {
      id: `v-${Date.now()}`,
      code: autoCode,
      dept: newViolation.dept,
      description: newViolation.description.trim(),
      action: newViolation.action.trim() || 'قيد تحديد الإجراء التصحيحي',
      status: 'pending',
      date: new Date().toISOString().slice(0, 10),
      month: selectedMonth
    };

    setViolations(prev => [createdItem, ...prev]);

    try {
      await violationsService.recordViolation(createdItem);
      addToast(`تم قيد المخالفة بنجاح بالكود الرسمي (${autoCode})`, 'success');
    } catch {
      addToast('تم حفظ المخالفة محلياً', 'info');
    } finally {
      setLoading(false);
      setIsAddModalOpen(false);
      setNewViolation({ dept: DEPARTMENTS_LIST[0], description: '', action: '' });
    }
  };

  // Compute live statistics
  const totalCount = violations.length;
  const closedCount = violations.filter(v => v.status === 'closed').length;
  const pendingCount = totalCount - closedCount;
  const computedResolutionRate = totalCount > 0 ? Math.round((closedCount / totalCount) * 100) : 100;

  const columns = [
    {
      header: 'كود المخالفة',
      accessor: 'code',
      width: '120px',
      render: (r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <strong style={{ color: 'var(--color-danger)', fontFamily: 'monospace', fontSize: '0.9375rem' }}>{r.code}</strong>
          <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)' }} title="معرف تدقيق معتمد">🔒</span>
        </div>
      )
    },
    {
      header: 'القسم المعني',
      accessor: 'dept',
      width: '150px',
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
      render: (r) => <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8125rem' }}>{r.action || 'في انتظار الإجراء'}</span>
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
    },
    {
      header: 'إجراء',
      accessor: 'id',
      width: '120px',
      render: (r) => (
        r.status === 'pending' ? (
          <Button variant="ghost" size="sm" onClick={() => openResolveDialog(r)} style={{ color: 'var(--color-success)', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
            <Check size={14} style={{ marginLeft: '4px' }} />
            إغلاق ومعالجة
          </Button>
        ) : (
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>معتمدة ✓</span>
        )
      )
    }
  ];

  return (
    <PageContainer>
      <PageHeader
        title="إدارة المخالفات والرقابة (Violations Administration)"
        description="رصد مخالفات الجودة والسلامة واللوائح الداخلية ومتابعة إجراءات التصحيح والالتزام."
        actions={
          <Button variant="primary" icon={Plus} size="sm" onClick={() => setIsAddModalOpen(true)}>
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
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>{totalCount} حالات</div>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ color: 'var(--color-success)', background: 'var(--color-success-bg)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <CheckCircle size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>نسبة معالجة الحالات</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-success)' }}>{computedResolutionRate}%</div>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ color: 'var(--color-warning)', background: 'var(--color-warning-bg)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <Clock size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>الحالات المفتوحة</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-warning)' }}>{pendingCount} حالة</div>
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
      />

      {/* Violations Log */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
            سجل المخالفات والإجراءات التصحيحية
          </h3>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
            متابعة دقيقة لكل حالة تم رصدها والإجراء الإداري والتنظيمي المتخذ حيالها (البيانات المرتبطة بأقسام الجودة والسلامة والإنتاج)
          </span>
        </div>

        <GlassCard style={{ padding: '0.5rem', overflow: 'hidden' }}>
          <DataTable columns={columns} data={violations} />
        </GlassCard>
      </div>

      {/* Modal: Add Violation */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="قيد مخالفة جديدة على النظام"
      >
        <form onSubmit={handleCreateViolation} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{
            padding: '0.75rem 1rem',
            background: 'var(--color-surface-hover)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>كود المخالفة الرقمي التلقائي</span>
              <strong style={{ color: 'var(--color-danger)', fontSize: '1rem', fontFamily: 'monospace' }}>
                سيتم توليده آلياً (🔒 كود رسمي معتمد)
              </strong>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>غير قابل للتعديل</span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
              القسم أو العنبر المعني بالمخالفة
            </label>
            <select
              value={newViolation.dept}
              onChange={(e) => setNewViolation(v => ({ ...v, dept: e.target.value }))}
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
              {DEPARTMENTS_LIST.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <TextField
            label="تفاصيل ووصف المخالفة المرصودة"
            placeholder="مثال: تشغيل ماكينة دون حاجز الحماية، تأخر إغلاق إذن الصرف..."
            value={newViolation.description}
            onChange={(e) => setNewViolation(v => ({ ...v, description: e.target.value }))}
            required
          />

          <TextField
            label="الإجراء التصحيحي الأولي المقترح"
            placeholder="مثال: توجيه إنذار كتابي، وقف الماكينة فوراً، إعادة التفتيش..."
            value={newViolation.action}
            onChange={(e) => setNewViolation(v => ({ ...v, action: e.target.value }))}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>
              إلغاء
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'جاري القيد...' : 'تسجيل المخالفة'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Resolve Violation */}
      <Modal
        isOpen={isResolveModalOpen}
        onClose={() => setIsResolveModalOpen(false)}
        title={selectedViolation ? `إغلاق ومعالجة المخالفة (${selectedViolation.code})` : 'معالجة المخالفة'}
      >
        <form onSubmit={handleResolveSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {selectedViolation && (
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-hover)', fontSize: '0.875rem' }}>
              <div style={{ color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>القسم: {selectedViolation.dept}</div>
              <div style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{selectedViolation.description}</div>
            </div>
          )}

          <TextField
            label="الإجراء التصحيحي النهائي والإفادة"
            placeholder="وضح كيف تمت معالجة المخالفة وما تم اتخاذه لضمان عدم التكرار..."
            value={resolveActionText}
            onChange={(e) => setResolveActionText(e.target.value)}
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button variant="ghost" type="button" onClick={() => setIsResolveModalOpen(false)}>
              إلغاء
            </Button>
            <Button variant="primary" type="submit">
              تأكيد المعالجة وإغلاق المخالفة
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}
