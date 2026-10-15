import React, { useState } from 'react';
import { useMonth } from '../../context/MonthContext';
import { PageContainer, PageHeader, Button, Modal, TextField, ConfirmDialog, EmptyState, GlassCard } from '../../components/common';
import { DepartmentSummary } from '../../components/departments/DepartmentSummary';
import { KpiPanel } from '../../components/departments/KpiPanel';
import { TeamMemberCard } from '../../components/departments/TeamMemberCard';
import { Plus, Users, Gauge, CheckSquare, AlertTriangle } from 'lucide-react';
import { useToast } from '../../components/common/Toast';

export default function Production() {
  const { selectedMonth } = useMonth();
  const { addToast } = useToast();
  const [managerName, setManagerName] = useState('م. سامح عزت');

  const [kpis, setKpis] = useState({
    efficiency: 88,
    waste: 14,
    commitment: 90
  });

  const [workers, setWorkers] = useState([
    { id: 'wrk-1', name: 'محمود علي', errors: 1, machine: 'ثناية هيدروليكية 1' },
    { id: 'wrk-2', name: 'إبراهيم صابر', errors: 0, machine: 'مقص أوتوماتيكي' },
    { id: 'wrk-3', name: 'سامح حسن', errors: 0, machine: 'خط اللحام الآلي' }
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [machineName, setMachineName] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const handleKpiChange = (key, value) => {
    setKpis((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddWorker = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setWorkers((prev) => [
      ...prev,
      {
        id: `wrk-${Date.now()}`,
        name: newName.trim(),
        errors: 0,
        machine: machineName.trim() || 'خط التجميع العام'
      }
    ]);
    setNewName('');
    setMachineName('');
    setIsAddOpen(false);
    addToast('تمت إضافة الفني/العامل بنجاح', 'success');
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      setWorkers((prev) => prev.filter((w) => w.id !== deleteTargetId));
      setDeleteTargetId(null);
      addToast('تم حذف السجل بنجاح', 'info');
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="إدارة الإنتاج (Production Management)"
        description="متابعة كفاءة خطوط التصنيع، تقليل نسبة الهدر والهالك، والتزام مواعيد وجداول التسليم."
        actions={
          <Button variant="primary" icon={Plus} size="sm" onClick={() => setIsAddOpen(true)}>
            إضافة فني / عامل
          </Button>
        }
      />

      <DepartmentSummary
        departmentTitle="إدارة خطوط الإنتاج والتشغيل"
        selectedMonth={selectedMonth}
        managerName={managerName}
        onManagerNameChange={setManagerName}
        accentColor="cyan"
      />

      {/* Quick Production Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <GlassCard style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ color: 'var(--color-cyan)', background: 'var(--color-cyan-bg)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <Gauge size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>الأوامر المنجزة</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>28 أمر تشغيل</div>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ color: 'var(--color-warning)', background: 'var(--color-warning-bg)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>نسبة الهدر الكلي</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>14% (طبيعي)</div>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ color: 'var(--color-success)', background: 'var(--color-success-bg)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <CheckSquare size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>التسليم في الموعد</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>90.5%</div>
          </div>
        </GlassCard>
      </div>

      <KpiPanel
        accentColor="cyan"
        kpis={[
          { key: 'efficiency', label: 'الكفاءة والإنتاجية (بدون أخطاء)', value: kpis.efficiency, color: 'cyan' },
          { key: 'waste', label: 'نسبة الهالك (تقليل الهدر)', value: kpis.waste, color: 'amber' },
          { key: 'commitment', label: 'الالتزام بمواعيد التسليم المحددة', value: kpis.commitment, color: 'green' }
        ]}
        onKpiChange={handleKpiChange}
      />

      {/* Workers Section */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
              فريق فنيي وعمال الإنتاج ({workers.length})
            </h3>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
              توزيع خطوط الإنتاج والماكينات المسندة ومعدل الأخطاء التشغيلية
            </span>
          </div>
        </div>

        {workers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="لا يوجد عمال أو فنيين مسجلين"
            description="يمكنك البدء بإضافة عامل جديد لخطوط الإنتاج ومتابعة أدائه."
            actionLabel="إضافة فني جديد"
            onAction={() => setIsAddOpen(true)}
          />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem'
          }}>
            {workers.map((worker) => (
              <TeamMemberCard
                key={worker.id}
                member={worker}
                onDelete={(id) => setDeleteTargetId(id)}
                roleLabel="فني تشغيل خط إنتاج"
                accentColor="cyan"
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="إضافة فني / عامل جديد لخط الإنتاج"
      >
        <form onSubmit={handleAddWorker}>
          <TextField
            label="اسم الفني أو العامل"
            placeholder="مثال: محمد سعيد"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            autoFocus
          />
          <TextField
            label="الماكينة أو محطة العمل"
            placeholder="مثال: ثناية هيدروليكية 2"
            value={machineName}
            onChange={(e) => setMachineName(e.target.value)}
          />
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <Button variant="ghost" onClick={() => setIsAddOpen(false)}>
              إلغاء
            </Button>
            <Button variant="primary" type="submit">
              حفظ
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={confirmDelete}
        title="حذف عامل"
        message="هل أنت متأكد من رغبتك في حذف هذا العامل من كشف الإنتاج؟"
        confirmText="تأكيد الحذف"
        cancelText="تراجع"
        isDestructive
      />
    </PageContainer>
  );
}
