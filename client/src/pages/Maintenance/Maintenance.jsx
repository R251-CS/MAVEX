import React, { useState } from 'react';
import { useMonth } from '../../context/MonthContext';
import { PageContainer, PageHeader, GlassCard, Button, StatusBadge, DataTable, Modal, TextField, ConfirmDialog } from '../../components/common';
import { DepartmentSummary } from '../../components/departments/DepartmentSummary';
import { KpiPanel } from '../../components/departments/KpiPanel';
import { Wrench, CheckCircle2, AlertTriangle, Plus, Activity, Trash2 } from 'lucide-react';
import { useToast } from '../../components/common/Toast';

const ORDER_TYPES = ['وقائية', 'دورية', 'طارئة', 'تصحيحية'];
const MACHINES_LIST = [
  'ثناية هيدروليكية 1',
  'ثناية هيدروليكية 2',
  'فايبر ليزر 6KW',
  'مقص ألواح CNC',
  'روبوت لحام محطة 2',
  'كابينة دهان إلكتروستاتيك',
  'كومبريسور مركزي',
  'رافعة جسرية 10 طن',
];

export default function Maintenance() {
  const { selectedMonth } = useMonth();
  const { addToast } = useToast();
  const [managerName, setManagerName] = useState('م. ياسر عبد الله');

  const [kpis, setKpis] = useState({
    uptime: 98.5,
    preventive: 92,
    mttr: 89
  });

  const [workOrders, setWorkOrders] = useState([
    { id: 'wo-1', machine: 'ثناية هيدروليكية 1', task: 'استبدال زيت الهيدروليك وفلاتر الضغط', type: 'وقائية', status: 'completed', date: '2026-10-11' },
    { id: 'wo-2', machine: 'مقص ألواح CNC', task: 'فحص ومعايرة حد السكين والشفرات', type: 'دورية', status: 'completed', date: '2026-10-13' },
    { id: 'wo-3', machine: 'روبوت لحام محطة 2', task: 'معايرة ذراع التغذية وتحديث البرنامج', type: 'طارئة', status: 'in_progress', date: '2026-10-15' }
  ]);

  // Modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [form, setForm] = useState({
    machine: MACHINES_LIST[0],
    task: '',
    type: 'وقائية',
    status: 'in_progress',
    date: new Date().toISOString().slice(0, 10),
    customMachine: ''
  });
  const [useCustomMachine, setUseCustomMachine] = useState(false);

  const handleKpiChange = (key, value) => {
    setKpis((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddOrder = (e) => {
    e.preventDefault();
    const machineVal = useCustomMachine ? form.customMachine.trim() : form.machine;
    if (!machineVal || !form.task.trim()) return;

    const newOrder = {
      id: `wo-${Date.now()}`,
      machine: machineVal,
      task: form.task.trim(),
      type: form.type,
      status: form.status,
      date: form.date
    };

    setWorkOrders(prev => [newOrder, ...prev]);
    setIsAddOpen(false);
    setForm({ machine: MACHINES_LIST[0], task: '', type: 'وقائية', status: 'in_progress', date: new Date().toISOString().slice(0, 10), customMachine: '' });
    setUseCustomMachine(false);
    addToast('تم تسجيل أمر الصيانة بنجاح', 'success');
  };

  const handleDelete = () => {
    if (deleteTargetId) {
      setWorkOrders(prev => prev.filter(w => w.id !== deleteTargetId));
      setDeleteTargetId(null);
      addToast('تم حذف أمر الصيانة', 'info');
    }
  };

  const handleStatusToggle = (id) => {
    setWorkOrders(prev => prev.map(w => {
      if (w.id !== id) return w;
      const next = w.status === 'completed' ? 'in_progress' : 'completed';
      addToast(next === 'completed' ? 'تم إغلاق أمر الصيانة بنجاح ✓' : 'تم إعادة فتح أمر الصيانة', next === 'completed' ? 'success' : 'info');
      return { ...w, status: next };
    }));
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
          color: r.type === 'طارئة' ? 'var(--color-danger)' : r.type === 'وقائية' ? 'var(--color-success)' : 'var(--color-primary)',
          background: r.type === 'طارئة' ? 'var(--color-danger-bg)' : r.type === 'وقائية' ? 'var(--color-success-bg)' : 'var(--color-primary-bg)',
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
      width: '140px',
      render: (r) => (
        <button
          type="button"
          onClick={() => handleStatusToggle(r.id)}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer'
          }}
          title="اضغط لتغيير الحالة"
        >
          <StatusBadge status={r.status === 'completed' ? 'success' : 'warning'} size="sm">
            {r.status === 'completed' ? 'تمت بنجاح ✓' : 'جاري العمل'}
          </StatusBadge>
        </button>
      )
    },
    {
      header: '',
      accessor: 'id',
      width: '60px',
      render: (r) => (
        <button
          type="button"
          onClick={() => setDeleteTargetId(r.id)}
          className="mx-icon-btn mx-icon-btn--danger mx-icon-btn--sm"
          title="حذف أمر الصيانة"
          aria-label="حذف"
        >
          <Trash2 size={15} />
        </button>
      )
    }
  ];

  const pendingCount = workOrders.filter(w => w.status !== 'completed').length;
  const completedCount = workOrders.filter(w => w.status === 'completed').length;
  const urgentCount = workOrders.filter(w => w.type === 'طارئة' && w.status !== 'completed').length;

  return (
    <PageContainer>
      <PageHeader
        title="الصيانة والتشغيل (Maintenance & Operations)"
        description="متابعة أوامر الصيانة الوقائية والطارئة، جاهزية الماكينات والمعدات الصناعية، وتقليل فترات التوقف."
        actions={
          <Button variant="primary" icon={Plus} size="sm" onClick={() => setIsAddOpen(true)}>
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>الأوامر المفتوحة</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: pendingCount > 0 ? 'var(--color-warning)' : 'var(--color-text-primary)' }}>
              {pendingCount} أمر
            </div>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ color: 'var(--color-success)', background: 'var(--color-success-bg)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>الأوامر المنجزة</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>{completedCount} أمر</div>
          </div>
        </GlassCard>

        {urgentCount > 0 && (
          <GlassCard style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid var(--color-danger-border)' }}>
            <div style={{ color: 'var(--color-danger)', background: 'var(--color-danger-bg)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>أعطال طارئة مفتوحة</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-danger)' }}>{urgentCount} طارئة</div>
            </div>
          </GlassCard>
        )}
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
            سجل أوامر الصيانة المنفذة والجارية ({workOrders.length})
          </h3>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
            بيان أعمال الصيانة الميكانيكية والكهربائية على ماكينات المصنع — اضغط على الحالة لتغييرها
          </span>
        </div>

        <GlassCard style={{ padding: '0.5rem', overflow: 'hidden' }}>
          <DataTable
            columns={columns}
            data={workOrders}
            searchPlaceholder="بحث في أوامر الصيانة..."
            searchKeys={['machine', 'task', 'type']}
          />
        </GlassCard>
      </div>

      {/* Add Work Order Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => { setIsAddOpen(false); setUseCustomMachine(false); }}
        title="إضافة أمر صيانة جديد"
      >
        <form onSubmit={handleAddOrder}>
          {/* Machine Select */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
              الماكينة / المعدة
            </label>
            {!useCustomMachine ? (
              <>
                <select
                  value={form.machine}
                  onChange={e => setForm({ ...form, machine: e.target.value })}
                  style={{
                    width: '100%', padding: '0.625rem 0.75rem',
                    borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-card)', color: 'var(--color-text-primary)', fontSize: '0.875rem'
                  }}
                >
                  {MACHINES_LIST.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <button
                  type="button"
                  onClick={() => setUseCustomMachine(true)}
                  style={{ marginTop: '0.4rem', background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.8rem', cursor: 'pointer', padding: 0 }}
                >
                  + إدخال ماكينة غير موجودة في القائمة
                </button>
              </>
            ) : (
              <>
                <TextField
                  placeholder="مثال: مضخة هيدروليك خط 3"
                  value={form.customMachine}
                  onChange={e => setForm({ ...form, customMachine: e.target.value })}
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setUseCustomMachine(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: '0.8rem', cursor: 'pointer', padding: 0 }}
                >
                  ← الرجوع للقائمة
                </button>
              </>
            )}
          </div>

          {/* Task */}
          <TextField
            label="مهمة الصيانة / الإجراء المطلوب"
            placeholder="مثال: استبدال زيت الهيدروليك وفلاتر الضغط"
            value={form.task}
            onChange={e => setForm({ ...form, task: e.target.value })}
            required
          />

          {/* Type & Status in a grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
                نوع الصيانة
              </label>
              <select
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
                style={{
                  width: '100%', padding: '0.625rem 0.75rem',
                  borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-card)', color: 'var(--color-text-primary)', fontSize: '0.875rem'
                }}
              >
                {ORDER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
                الحالة
              </label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                style={{
                  width: '100%', padding: '0.625rem 0.75rem',
                  borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-card)', color: 'var(--color-text-primary)', fontSize: '0.875rem'
                }}
              >
                <option value="in_progress">جاري العمل</option>
                <option value="completed">تمت بنجاح</option>
              </select>
            </div>
          </div>

          {/* Date */}
          <TextField
            label="تاريخ الإجراء"
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            required
          />

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <Button variant="ghost" onClick={() => { setIsAddOpen(false); setUseCustomMachine(false); }}>إلغاء</Button>
            <Button variant="primary" type="submit">حفظ أمر الصيانة</Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="حذف أمر صيانة"
        message="هل أنت متأكد من رغبتك في حذف هذا الأمر من سجل الصيانة؟"
        confirmText="تأكيد الحذف"
        cancelText="تراجع"
        isDestructive
      />
    </PageContainer>
  );
}
