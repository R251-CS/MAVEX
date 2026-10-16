import React, { useState, useEffect } from 'react';
import { useMonth } from '../../context/MonthContext';
import { PageContainer, PageHeader, Button, Modal, TextField, ConfirmDialog, EmptyState, GlassCard, StatusBadge } from '../../components/common';
import { DepartmentSummary } from '../../components/departments/DepartmentSummary';
import { KpiPanel } from '../../components/departments/KpiPanel';
import { TeamMemberCard } from '../../components/departments/TeamMemberCard';
import { 
  Plus, 
  Users, 
  Gauge, 
  CheckSquare, 
  AlertTriangle, 
  Layers, 
  Flame, 
  FoldHorizontal, 
  Paintbrush, 
  Clock, 
  MessageSquare, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useToast } from '../../components/common/Toast';

const STAGE_ICONS = {
  material_receipt: Layers,
  laser: Flame,
  bending: FoldHorizontal,
  finishing_paint: Paintbrush
};

export default function Production() {
  const { selectedMonth } = useMonth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'workers' | 'kpis'
  const [managerName, setManagerName] = useState('م. سامح عزت');

  const [kpis, setKpis] = useState({
    efficiency: 88,
    waste: 14,
    commitment: 90
  });

  const [orders, setOrders] = useState([
    {
      id: 'ord-1',
      code: 'WO-2026-101',
      productName: 'كبائن توزيع كهربائية معزولة IP65',
      category: 'لوحات تحكم كهربائية',
      rawMaterials: 'صاج مجلفن 2 مم (3.5 طن) + زوايا تثبيت',
      currentStage: 'bending',
      status: 'in_progress',
      delayReason: '',
      delayComment: '',
      stages: [
        { key: 'material_receipt', name: 'استلام الخامات', status: 'completed', completedAt: '2026-10-12', operator: 'خالد السيد' },
        { key: 'laser', name: 'القطع بالليزر', status: 'completed', completedAt: '2026-10-14', operator: 'إبراهيم صابر' },
        { key: 'bending', name: 'الثناية والتشكيل', status: 'in_progress', completedAt: null, operator: 'محمود علي' },
        { key: 'finishing_paint', name: 'التشطيب والدهان', status: 'pending', completedAt: null, operator: 'خط الدهان' }
      ]
    },
    {
      id: 'ord-2',
      code: 'WO-2026-102',
      productName: 'خزانات وقود ديزل احتياطي 5000 لتر',
      category: 'خزانات وأوعية ضغط',
      rawMaterials: 'صاج أسود مسحوب 4 مم (8 طن)',
      currentStage: 'laser',
      status: 'delayed',
      delayReason: 'تأخر فحص الغاز وعينات النيتروجين',
      delayComment: 'تم استلام الأسطوانات البديلة وسيتم استئناف الليزر خلال الوردية الصباحية',
      stages: [
        { key: 'material_receipt', name: 'استلام الخامات', status: 'completed', completedAt: '2026-10-11', operator: 'خالد السيد' },
        { key: 'laser', name: 'القطع بالليزر', status: 'in_progress', completedAt: null, operator: 'إبراهيم صابر' },
        { key: 'bending', name: 'الثناية والتشكيل', status: 'pending', completedAt: null, operator: 'محمود علي' },
        { key: 'finishing_paint', name: 'التشطيب والدهان', status: 'pending', completedAt: null, operator: 'خط الدهان' }
      ]
    },
    {
      id: 'ord-3',
      code: 'WO-2026-103',
      productName: 'هيكل شاسيه محطة طاقة شمسية قطاع ج',
      category: 'هياكل معدنية ثقيلة',
      rawMaterials: 'كمرات صلب مجلفن UPN (12 طن)',
      currentStage: 'finishing_paint',
      status: 'in_progress',
      delayReason: '',
      delayComment: '',
      stages: [
        { key: 'material_receipt', name: 'استلام الخامات', status: 'completed', completedAt: '2026-10-08', operator: 'خالد السيد' },
        { key: 'laser', name: 'القطع بالليزر', status: 'completed', completedAt: '2026-10-10', operator: 'إبراهيم صابر' },
        { key: 'bending', name: 'الثناية والتشكيل', status: 'completed', completedAt: '2026-10-13', operator: 'محمود علي' },
        { key: 'finishing_paint', name: 'التشطيب والدهان', status: 'in_progress', completedAt: null, operator: 'كابينة الدهان 1' }
      ]
    }
  ]);

  const [workers, setWorkers] = useState([
    { id: 'wrk-1', name: 'فني محمود علي', errors: 1, machine: 'ثناية هيدروليكية 150 طن', basicSalary: 5500, incentives: 1200, deductions: 0 },
    { id: 'wrk-2', name: 'فني إبراهيم صابر', errors: 0, machine: 'فايبر ليزر 6KW', basicSalary: 5800, incentives: 1400, deductions: 100 },
    { id: 'wrk-3', name: 'فني سامح حسن', errors: 0, machine: 'كابينة دهان إلكتروستاتيك', basicSalary: 5200, incentives: 1100, deductions: 0 }
  ]);

  // Modals state
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    code: '',
    productName: '',
    category: 'لوحات تحكم كهربائية',
    rawMaterials: ''
  });

  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [stageForm, setStageForm] = useState({
    stageKey: 'laser',
    status: 'completed',
    delayReason: '',
    delayComment: ''
  });

  const [isAddWorkerOpen, setIsAddWorkerOpen] = useState(false);
  const [newWorker, setNewWorker] = useState({ name: '', machine: '', basicSalary: 5000, incentives: 1000 });
  const [deleteWorkerId, setDeleteWorkerId] = useState(null);

  // Fetch live orders from backend
  useEffect(() => {
    fetch('/api/v1/production/orders', {
      headers: { 'x-dev-user': '1' }
    })
      .then(res => res.json())
      .then(res => {
        if (res?.data?.orders && res.data.orders.length > 0) {
          setOrders(res.data.orders);
        }
      })
      .catch(() => {});
  }, []);

  const handleKpiChange = (key, value) => {
    setKpis(prev => ({ ...prev, [key]: value }));
  };

  const handleCreateOrder = (e) => {
    e.preventDefault();
    if (!newOrder.productName.trim()) return;

    const stages = [
      { key: 'material_receipt', name: 'استلام الخامات', status: 'completed', completedAt: new Date().toISOString().slice(0, 10), operator: 'أمين المخزن' },
      { key: 'laser', name: 'القطع بالليزر', status: 'in_progress', completedAt: null, operator: 'فني الليزر' },
      { key: 'bending', name: 'الثناية والتشكيل', status: 'pending', completedAt: null, operator: 'فني الثناية' },
      { key: 'finishing_paint', name: 'التشطيب والدهان', status: 'pending', completedAt: null, operator: 'خط الدهان' }
    ];

    const orderObj = {
      id: `ord-${Date.now()}`,
      code: newOrder.code.trim() || `WO-${Date.now().toString().slice(-4)}`,
      productName: newOrder.productName.trim(),
      category: newOrder.category,
      rawMaterials: newOrder.rawMaterials.trim() || 'خامات معيارية',
      currentStage: 'laser',
      status: 'in_progress',
      delayReason: '',
      delayComment: '',
      stages
    };

    setOrders(prev => [orderObj, ...prev]);

    // Send to backend
    fetch('/api/v1/production/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-dev-user': '1' },
      body: JSON.stringify(orderObj)
    }).catch(() => {});

    setIsNewOrderOpen(false);
    setNewOrder({ code: '', productName: '', category: 'لوحات تحكم كهربائية', rawMaterials: '' });
    addToast('تم إنشاء أمر التشغيل وتحديد مراحله وخاماته بنجاح', 'success');
  };

  const openStageModal = (order, stageKey) => {
    setSelectedOrder(order);
    const st = order.stages.find(s => s.key === stageKey);
    setStageForm({
      stageKey,
      status: st?.status || 'in_progress',
      delayReason: order.delayReason || '',
      delayComment: order.delayComment || ''
    });
    setIsStageModalOpen(true);
  };

  const handleSaveStage = (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const nextStages = selectedOrder.stages.map(st => {
      if (st.key === stageForm.stageKey) {
        return {
          ...st,
          status: stageForm.status,
          completedAt: stageForm.status === 'completed' ? new Date().toISOString().slice(0, 10) : st.completedAt
        };
      }
      return st;
    });

    const isDelayed = !!stageForm.delayReason.trim();

    const updatedOrder = {
      ...selectedOrder,
      stages: nextStages,
      status: isDelayed ? 'delayed' : (stageForm.status === 'completed' && stageForm.stageKey === 'finishing_paint' ? 'completed' : 'in_progress'),
      delayReason: stageForm.delayReason,
      delayComment: stageForm.delayComment,
      currentStage: stageForm.status === 'completed' ? getNextStageKey(stageForm.stageKey) : stageForm.stageKey
    };

    setOrders(prev => prev.map(o => o.id === selectedOrder.id ? updatedOrder : o));

    fetch(`/api/v1/production/orders/${selectedOrder.id}/stages/${stageForm.stageKey}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-dev-user': '1' },
      body: JSON.stringify({
        status: stageForm.status,
        delayReason: stageForm.delayReason,
        delayComment: stageForm.delayComment
      })
    }).catch(() => {});

    setIsStageModalOpen(false);
    addToast('تم تحديث مرحلة التشغيل وملاحظات التأخير بنجاح', 'success');
  };

  const getNextStageKey = (current) => {
    const keys = ['material_receipt', 'laser', 'bending', 'finishing_paint'];
    const idx = keys.indexOf(current);
    if (idx >= 0 && idx < keys.length - 1) return keys[idx + 1];
    return 'finishing_paint';
  };

  const handleAddWorker = (e) => {
    e.preventDefault();
    if (!newWorker.name.trim()) return;
    setWorkers(prev => [
      ...prev,
      {
        id: `wrk-${Date.now()}`,
        name: newWorker.name.trim(),
        errors: 0,
        machine: newWorker.machine.trim() || 'خط التجميع العام',
        basicSalary: Number(newWorker.basicSalary) || 5000,
        incentives: Number(newWorker.incentives) || 1000,
        deductions: 0
      }
    ]);
    setNewWorker({ name: '', machine: '', basicSalary: 5000, incentives: 1000 });
    setIsAddWorkerOpen(false);
    addToast('تمت إضافة الفني وحساب راتبه بنجاح', 'success');
  };

  return (
    <PageContainer>
      <PageHeader
        title="إدارة الإنتاج والتصنيع (Manufacturing & Production)"
        description="متابعة دورة حياة المنتج ومراحل التصنيع (الخامات، الليزر، الثناية، التشطيب والدهان) وأسباب التأخير."
        actions={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="primary" icon={Plus} size="sm" onClick={() => setIsNewOrderOpen(true)}>
              أمر تصنيع جديد
            </Button>
            <Button variant="secondary" icon={Users} size="sm" onClick={() => setIsAddWorkerOpen(true)}>
              إضافة فني
            </Button>
          </div>
        }
      />

      <DepartmentSummary
        departmentTitle="إدارة خطوط الإنتاج والتصنيع الميكانيكي"
        selectedMonth={selectedMonth}
        managerName={managerName}
        onManagerNameChange={setManagerName}
        accentColor="cyan"
      />

      {/* Tabs Switcher */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '1.5rem',
        paddingBottom: '0.25rem'
      }}>
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '0.6rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'orders' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
            color: activeTab === 'orders' ? 'var(--accent-cyan)' : 'var(--color-text-secondary)',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Layers size={16} /> أوامر التصنيع ومراحل التشغيل ({orders.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('workers')}
          style={{
            padding: '0.6rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'workers' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
            color: activeTab === 'workers' ? 'var(--accent-cyan)' : 'var(--color-text-secondary)',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Users size={16} /> فنيو الإنتاج والماكينات والرواتب ({workers.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('kpis')}
          style={{
            padding: '0.6rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'kpis' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
            color: activeTab === 'kpis' ? 'var(--accent-cyan)' : 'var(--color-text-secondary)',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Gauge size={16} /> مؤشرات الكفاءة والالتزام
        </button>
      </div>

      {/* TAB 1: PRODUCTION ORDERS & STAGES PIPELINE (FR-04 to FR-12) */}
      {activeTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {orders.map((order) => {
            const isDelayed = order.status === 'delayed' || !!order.delayReason;
            return (
              <GlassCard key={order.id} style={{ padding: '1.5rem', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 800, color: 'var(--accent-cyan)', fontSize: '1rem' }}>{order.code}</span>
                      <StatusBadge status={order.status === 'completed' ? 'success' : isDelayed ? 'error' : 'warning'} size="sm">
                        {order.status === 'completed' ? 'مكتمل الإنتاج' : isDelayed ? 'تأخير في المرحلة' : 'قيد التشغيل'}
                      </StatusBadge>
                      <span style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(255,255,255,0.05)',
                        fontSize: '0.75rem',
                        color: 'var(--color-text-muted)'
                      }}>
                        {order.category}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
                      {order.productName}
                    </h3>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                      الخامات المستخدمة: <strong style={{ color: 'var(--color-text-secondary)' }}>{order.rawMaterials}</strong>
                    </div>
                  </div>

                  <div style={{ textAlign: 'left' }}>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openStageModal(order, order.currentStage)}
                    >
                      تحديث المرحلة / سبب التأخير
                    </Button>
                  </div>
                </div>

                {/* 4-Stages Flow Visualizer */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '0.75rem',
                  marginTop: '1rem',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  {order.stages.map((stage, idx) => {
                    const IconComp = STAGE_ICONS[stage.key] || Layers;
                    const isDone = stage.status === 'completed';
                    const isCurrent = stage.key === order.currentStage && !isDone;
                    return (
                      <div
                        key={stage.key}
                        onClick={() => openStageModal(order, stage.key)}
                        style={{
                          cursor: 'pointer',
                          padding: '0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          border: `1px solid ${isDone ? 'var(--color-success-border)' : isCurrent ? (isDelayed ? 'var(--color-danger-border)' : 'var(--color-cyan-border)') : 'var(--border-subtle)'}`,
                          background: isDone ? 'rgba(34, 197, 94, 0.06)' : isCurrent ? (isDelayed ? 'rgba(239, 68, 68, 0.08)' : 'rgba(6, 182, 212, 0.08)') : 'transparent',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>مرحلة {idx + 1}</span>
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: isDone ? 'var(--color-success)' : isCurrent ? (isDelayed ? 'var(--color-danger)' : 'var(--accent-cyan)') : 'var(--color-text-muted)'
                          }}>
                            {isDone ? 'مكتملة ✓' : isCurrent ? (isDelayed ? 'معطلة' : 'قيد العمل') : 'في الانتظار'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '0.875rem' }}>
                          <IconComp size={16} color={isDone ? 'var(--color-success)' : isCurrent ? 'var(--accent-cyan)' : 'var(--color-text-muted)'} />
                          <span>{stage.name}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
                          المسؤول: {stage.operator || 'فني المحطة'}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Delay & Comments Panel (FR-08, FR-12) */}
                {(order.delayReason || order.delayComment) && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '0.875rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem'
                  }}>
                    {order.delayReason && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-red)', fontSize: '0.8125rem', fontWeight: 700 }}>
                        <AlertTriangle size={16} />
                        <span>سبب التأخير: {order.delayReason}</span>
                      </div>
                    )}
                    {order.delayComment && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.8125rem' }}>
                        <MessageSquare size={14} color="var(--color-text-muted)" />
                        <span>تعليق المتابعة: {order.delayComment}</span>
                      </div>
                    )}
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* TAB 2: WORKERS & SALARIES (FR-17, FR-18) */}
      {activeTab === 'workers' && (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem'
          }}>
            {workers.map((worker) => (
              <TeamMemberCard
                key={worker.id}
                member={worker}
                onDelete={(id) => setDeleteWorkerId(id)}
                roleLabel="فني تشغيل خط إنتاج"
                accentColor="cyan"
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: KPIS & EFFICIENCY */}
      {activeTab === 'kpis' && (
        <KpiPanel
          accentColor="cyan"
          kpis={[
            { key: 'efficiency', label: 'الكفاءة والإنتاجية (بدون أخطاء)', value: kpis.efficiency, color: 'cyan' },
            { key: 'waste', label: 'نسبة الهالك (تقليل الهدر)', value: kpis.waste, color: 'amber' },
            { key: 'commitment', label: 'الالتزام بمواعيد التسليم المحددة', value: kpis.commitment, color: 'green' }
          ]}
          onKpiChange={handleKpiChange}
        />
      )}

      {/* Modal: New Production Order (FR-04, FR-05, FR-10) */}
      <Modal
        isOpen={isNewOrderOpen}
        onClose={() => setIsNewOrderOpen(false)}
        title="إنشاء أمر تشغيل وتصنيع جديد"
      >
        <form onSubmit={handleCreateOrder}>
          <TextField
            label="كود أمر التشغيل"
            placeholder="مثال: WO-2026-104"
            value={newOrder.code}
            onChange={(e) => setNewOrder({ ...newOrder, code: e.target.value })}
          />
          <TextField
            label="اسم المنتج المطلوب تصنيعه"
            placeholder="مثال: كبائن توزيع كهربائية 3 فاز"
            value={newOrder.productName}
            onChange={(e) => setNewOrder({ ...newOrder, productName: e.target.value })}
            required
            autoFocus
          />
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
              تصنيف المنتج
            </label>
            <select
              value={newOrder.category}
              onChange={(e) => setNewOrder({ ...newOrder, category: e.target.value })}
              style={{
                width: '100%',
                padding: '0.625rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-card)',
                color: 'var(--color-text-primary)',
                fontSize: '0.875rem'
              }}
            >
              <option value="لوحات تحكم كهربائية">لوحات تحكم كهربائية</option>
              <option value="خزانات وأوعية ضغط">خزانات وأوعية ضغط</option>
              <option value="هياكل معدنية ثقيلة">هياكل معدنية ثقيلة</option>
              <option value="شاسيهات وقواعد ماكينات">شاسيهات وقواعد ماكينات</option>
            </select>
          </div>
          <TextField
            label="الخامات المستخدمة وتفاصيلها"
            placeholder="مثال: صاج مجلفن 3 مم + زوايا حديد 50*50"
            value={newOrder.rawMaterials}
            onChange={(e) => setNewOrder({ ...newOrder, rawMaterials: e.target.value })}
            helperText="ربط أمر الإنتاج بالخامات المطلوبة من المستودع"
          />

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <Button variant="ghost" onClick={() => setIsNewOrderOpen(false)}>إلغاء</Button>
            <Button variant="primary" type="submit">بدء أمر التشغيل</Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Update Stage & Delay Reason / Comments (FR-08, FR-12) */}
      <Modal
        isOpen={isStageModalOpen}
        onClose={() => setIsStageModalOpen(false)}
        title={`تحديث مرحلة أمر التشغيل (${selectedOrder?.code})`}
      >
        <form onSubmit={handleSaveStage}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
              المرحلة المراد تحديثها
            </label>
            <select
              value={stageForm.stageKey}
              onChange={(e) => setStageForm({ ...stageForm, stageKey: e.target.value })}
              style={{
                width: '100%',
                padding: '0.625rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-card)',
                color: 'var(--color-text-primary)',
                fontSize: '0.875rem'
              }}
            >
              <option value="material_receipt">1. استلام وفحص الخامات</option>
              <option value="laser">2. القطع بالليزر (Fiber Laser)</option>
              <option value="bending">3. الثناية والتشكيل (Bending)</option>
              <option value="finishing_paint">4. التشطيب والدهان الإلكتروستاتيك</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
              حالة المرحلة
            </label>
            <select
              value={stageForm.status}
              onChange={(e) => setStageForm({ ...stageForm, status: e.target.value })}
              style={{
                width: '100%',
                padding: '0.625rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-card)',
                color: 'var(--color-text-primary)',
                fontSize: '0.875rem'
              }}
            >
              <option value="in_progress">قيد التشغيل حالياً</option>
              <option value="completed">اكتملت المرحلة بنجاح ✓</option>
              <option value="pending">في الانتظار</option>
            </select>
          </div>

          <TextField
            label="سبب التأخير (إن وجد)"
            placeholder="مثال: صيانة طارئة للعدسة البصرية في الليزر"
            value={stageForm.delayReason}
            onChange={(e) => setStageForm({ ...stageForm, delayReason: e.target.value })}
          />

          <TextField
            label="تعليق إداري أو فني (Comment)"
            placeholder="مثال: تم إبلاغ الصيانة وتجهيز قطعة الغيار"
            value={stageForm.delayComment}
            onChange={(e) => setStageForm({ ...stageForm, delayComment: e.target.value })}
            helperText="خانة التعليق لتوثيق ومتابعة الحلول والتنسيق بين الأقسام"
          />

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <Button variant="ghost" onClick={() => setIsStageModalOpen(false)}>إلغاء</Button>
            <Button variant="primary" type="submit">حفظ التحديثات</Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Worker */}
      <Modal
        isOpen={isAddWorkerOpen}
        onClose={() => setIsAddWorkerOpen(false)}
        title="إضافة فني إنتاج وتحديد راتبه"
      >
        <form onSubmit={handleAddWorker}>
          <TextField
            label="اسم الفني"
            placeholder="مثال: محمود علي"
            value={newWorker.name}
            onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
            required
            autoFocus
          />
          <TextField
            label="الماكينة المسندة"
            placeholder="مثال: ثناية هيدروليكية 150 طن"
            value={newWorker.machine}
            onChange={(e) => setNewWorker({ ...newWorker, machine: e.target.value })}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <TextField
              label="الراتب الأساسي (ج.م)"
              type="number"
              value={newWorker.basicSalary}
              onChange={(e) => setNewWorker({ ...newWorker, basicSalary: e.target.value })}
              required
            />
            <TextField
              label="الحوافز والمكافآت (ج.م)"
              type="number"
              value={newWorker.incentives}
              onChange={(e) => setNewWorker({ ...newWorker, incentives: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <Button variant="ghost" onClick={() => setIsAddWorkerOpen(false)}>إلغاء</Button>
            <Button variant="primary" type="submit">إضافة الفني</Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Worker */}
      <ConfirmDialog
        isOpen={!!deleteWorkerId}
        onClose={() => setDeleteWorkerId(null)}
        onConfirm={() => {
          setWorkers(prev => prev.filter(w => w.id !== deleteWorkerId));
          setDeleteWorkerId(null);
          addToast('تم حذف سجل الفني بنجاح', 'info');
        }}
        title="حذف فني إنتاج"
        message="هل أنت متأكد من رغبتك في حذف هذا الفني من كشف الإنتاج؟"
        confirmText="تأكيد الحذف"
        cancelText="تراجع"
        isDestructive
      />
    </PageContainer>
  );
}
