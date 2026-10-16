import React, { useState, useEffect } from 'react';
import { useMonth } from '../../context/MonthContext';
import { PageContainer, PageHeader, Button, Modal, TextField, SelectField, DataTable, StatusBadge, GlassCard, ConfirmDialog } from '../../components/common';
import { DepartmentSummary } from '../../components/departments/DepartmentSummary';
import { KpiPanel } from '../../components/departments/KpiPanel';
import { Plus, CheckSquare, Trash2, ShieldCheck, AlertCircle, Search, Sparkles } from 'lucide-react';
import { useToast } from '../../components/common/Toast';
import qualityService from '../../services/qualityService';
import dashboardService from '../../services/dashboardService';

export default function Quality() {
  const { selectedMonth } = useMonth();
  const { addToast } = useToast();
  const [managerName, setManagerName] = useState('م. طارق محمود');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const [kpis, setKpis] = useState({
    acceptance: 95,
    inspection: 92,
    customer: 98
  });

  const [records, setRecords] = useState([
    {
      id: 'REC-2026-101',
      date: '2026-10-12',
      item: 'دفعة صاج مجلفن 1.5 مم (وارد مورد)',
      issue: 'تفاوت طفيف في سمك طبقة الجلفنة - تم التوجيه بالعزل',
      status: 'pending'
    },
    {
      id: 'REC-2026-102',
      date: '2026-10-10',
      item: 'مجموعات لحام الهيكل المعدني الحامل',
      issue: 'اجتياز الفحص غير الإتلافي بالأشعة بنجاح تام',
      status: 'resolved'
    },
    {
      id: 'REC-2026-103',
      date: '2026-10-06',
      item: 'قطاعات الألومنيوم المؤكسد',
      issue: 'مطابقة تامة للمواصفات القياسية ISO-9001',
      status: 'resolved'
    }
  ]);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const events = await qualityService.getQualityEvents(selectedMonth);
        if (isMounted && events && events.length > 0) {
          const mapped = events.map(e => ({
            id: e.id || `REC-${Date.now().toString().slice(-4)}`,
            date: e.date || new Date().toISOString().slice(0, 10),
            item: e.itemOrMachine || e.title || e.item || 'عينة فحص',
            issue: e.issue || e.description || e.notes || (e.status === 'passed' ? 'مطابقة للمواصفات الفنية' : 'عدم مطابقة'),
            status: e.status === 'passed' ? 'resolved' : 'pending'
          }));
          setRecords(mapped);
        }

        const dashRes = await dashboardService.getDashboard(selectedMonth);
        const data = dashRes?.data || dashRes;
        const dept = (data?.departments || []).find(d => d.departmentId === 'quality');
        if (isMounted && dept?.kpis) {
          setKpis({
            acceptance: parseInt(dept.kpis.acceptance, 10) || 95,
            inspection: Number(dept.kpis.inspection) || 92,
            customer: Number(dept.kpis.customer) || 98
          });
        }
      } catch (err) {
        console.warn('Quality load notice:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [selectedMonth]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    item: '',
    issue: '',
    status: 'pending'
  });


  const handleAddRecord = async (e) => {
    e.preventDefault();
    if (!form.item.trim() || !form.issue.trim()) return;

    const newCode = `REC-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`;
    const newRecord = {
      id: newCode,
      date: form.date,
      item: form.item.trim(),
      issue: form.issue.trim(),
      status: form.status
    };

    setRecords((prev) => [newRecord, ...prev]);
    setIsAddOpen(false);

    try {
      await qualityService.addQualityEvent({
        title: form.item.trim(),
        itemOrMachine: form.item.trim(),
        issue: form.issue.trim(),
        status: form.status === 'resolved' ? 'passed' : 'rejected',
        month: selectedMonth,
        date: form.date,
        isViolation: form.status === 'pending'
      });

      if (form.status === 'pending') {
        addToast('تم تسجيل الفحص وإرسال إشعار عدم مطابقة تلقائياً لإدارة المخالفات', 'warning');
      } else {
        addToast('تم توثيق تقرير الجودة بنجاح واعتماد النتيجة', 'success');
      }
    } catch (err) {
      addToast('تم حفظ التقرير محلياً (وضع عدم الاتصال)', 'info');
    }

    setForm({
      date: new Date().toISOString().slice(0, 10),
      item: '',
      issue: '',
      status: 'pending'
    });
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      setRecords((prev) => prev.filter((r) => r.id !== deleteTargetId));
      setDeleteTargetId(null);
      addToast('تم أرشفة السجل بنجاح', 'info');
    }
  };


  const filteredRecords = records.filter(
    (r) =>
      r.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.issue.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      header: 'تاريخ الفحص',
      accessor: 'date',
      width: '130px',
      render: (row) => <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>{row.date}</span>
    },
    {
      header: 'العينة / البند المفحوص',
      accessor: 'item',
      render: (row) => <strong style={{ color: 'var(--color-text-primary)', fontSize: '0.9375rem' }}>{row.item}</strong>
    },
    {
      header: 'الملاحظة الفنية / العيب',
      accessor: 'issue',
      render: (row) => <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{row.issue}</span>
    },
    {
      header: 'حالة المطابقة',
      accessor: 'status',
      width: '150px',
      render: (row) => (
        <StatusBadge
          status={row.status === 'resolved' ? 'success' : row.status === 'pending' ? 'warning' : 'error'}
          size="sm"
        >
          {row.status === 'resolved' ? 'مطابق / معتمد' : row.status === 'pending' ? 'قيد التدقيق' : 'غير مطابق'}
        </StatusBadge>
      )
    },
    {
      header: 'إجراءات',
      width: '80px',
      render: (row) => (
        <button
          type="button"
          onClick={() => setDeleteTargetId(row.id)}
          className="mx-icon-btn mx-icon-btn--danger mx-icon-btn--sm"
          title="حذف السجل"
          aria-label="حذف السجل"
        >
          <Trash2 size={16} />
        </button>
      )
    }
  ];

  return (
    <PageContainer>
      <PageHeader
        title="مراقبة وتأكيد الجودة (Quality Assurance)"
        description="فحص الخامات الواردة، اختبارات خطوط الإنتاج، ومراقبة رضا وقبول العميل النهائي."
        actions={
          <Button variant="primary" icon={Plus} size="sm" onClick={() => setIsAddOpen(true)}>
            تسجيل فحص جديد
          </Button>
        }
      />

      <DepartmentSummary
        departmentTitle="إدارة توكيد وضبط الجودة الشاملة"
        selectedMonth={selectedMonth}
        managerName={managerName}
        onManagerNameChange={setManagerName}
        accentColor="green"
      />

      {/* Quick Quality Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <GlassCard style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ color: 'var(--color-success)', background: 'var(--color-success-bg)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>معدل القبول النهائي</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>95.8%</div>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ color: 'var(--color-primary)', background: 'var(--color-primary-bg)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <CheckSquare size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>الفحوصات المنجزة</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>68 عينة</div>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ color: 'var(--color-warning)', background: 'var(--color-warning-bg)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <AlertCircle size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>معدل العيوب التراكمي</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>1.2% (ممتاز)</div>
          </div>
        </GlassCard>
      </div>

      <KpiPanel
        accentColor="green"
        kpis={[
          { key: 'acceptance', label: 'نسبة القبول في الفحص النهائي للمنتج', value: kpis.acceptance, color: 'green' },
          { key: 'inspection', label: 'دقة وتغطية الفحص المرحلي للعينات', value: kpis.inspection, color: 'blue' },
          { key: 'customer', label: 'معدل رضا العميل النهائي وخلو الشكاوى', value: kpis.customer, color: 'purple' }
        ]}
      />

      {/* Quality Records Table */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
              سجلات الفحص وتقارير الجودة ({records.length})
            </h3>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
              قائمة الفحوصات المرحلية والنهائية المسجلة لشهر المتابعة
            </span>
          </div>

          <div style={{ width: '260px' }}>
            <TextField
              placeholder="بحث في السجلات أو العينات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>
        </div>

        <GlassCard style={{ padding: '0.5rem', overflow: 'hidden' }}>
          <DataTable
            columns={columns}
            data={filteredRecords}
            emptyMessage={searchQuery ? 'لا توجد نتائج مطابقة لبحثك' : 'لا توجد فحوصات أو بلاغات جودة مسجلة لهذا الشهر'}
          />
        </GlassCard>
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="تسجيل تقرير فحص جودة جديد"
      >
        <form onSubmit={handleAddRecord}>
          <TextField
            label="تاريخ الفحص"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
          <TextField
            label="العينة أو القطعة المفحوصة"
            placeholder="مثال: قطاع ألومنيوم معالج كيميائياً"
            value={form.item}
            onChange={(e) => setForm({ ...form, item: e.target.value })}
            required
          />
          <TextField
            label="الملاحظة أو نتيجة الفحص"
            placeholder="اكتب التقرير أو العيب المكتشف..."
            value={form.issue}
            onChange={(e) => setForm({ ...form, issue: e.target.value })}
            required
          />
          <SelectField
            label="حالة المطابقة"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            options={[
              { value: 'pending', label: 'قيد المراجعة والتدقيق' },
              { value: 'resolved', label: 'مطابق للمواصفات / تم الاعتماد' },
              { value: 'rejected', label: 'مرفوض وغير مطابق' }
            ]}
          />
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <Button variant="ghost" onClick={() => setIsAddOpen(false)}>
              إلغاء
            </Button>
            <Button variant="primary" type="submit">
              حفظ التقرير
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={confirmDelete}
        title="حذف تقرير فحص"
        message="هل أنت متأكد من رغبتك في حذف هذا السجل من تقارير الجودة؟"
        confirmText="تأكيد الحذف"
        cancelText="تراجع"
        isDestructive
      />
    </PageContainer>
  );
}
