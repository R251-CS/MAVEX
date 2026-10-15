import React, { useState } from 'react';
import { useMonth } from '../../context/MonthContext';
import { PageContainer, PageHeader, Button, Modal, TextField, ConfirmDialog, EmptyState, GlassCard } from '../../components/common';
import { DepartmentSummary } from '../../components/departments/DepartmentSummary';
import { KpiPanel } from '../../components/departments/KpiPanel';
import { TeamMemberCard } from '../../components/departments/TeamMemberCard';
import { Plus, Users, FileCode, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '../../components/common/Toast';

export default function TechnicalOffice() {
  const { selectedMonth } = useMonth();
  const { addToast } = useToast();
  const [managerName, setManagerName] = useState('م. أحمد حسن');

  const [kpis, setKpis] = useState({
    speed: 85,
    lowErrors: 90,
    development: 80
  });

  const [engineers, setEngineers] = useState([
    { id: 'eng-1', name: 'محمود طه', errors: 1, machines: 2 },
    { id: 'eng-2', name: 'كريم عبد العزيز', errors: 0, machines: 3 }
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const handleKpiChange = (key, value) => {
    setKpis((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddEngineer = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setEngineers((prev) => [
      ...prev,
      { id: `eng-${Date.now()}`, name: newName.trim(), errors: 0, machines: 1 }
    ]);
    setNewName('');
    setIsAddOpen(false);
    addToast('تمت إضافة المهندس بنجاح', 'success');
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      setEngineers((prev) => prev.filter((eng) => eng.id !== deleteTargetId));
      setDeleteTargetId(null);
      addToast('تم حذف السجل بنجاح', 'info');
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="المكتب الفني (Technical Office)"
        description="متابعة مؤشرات أداء المهندسين، سرعة إعداد الرسومات التنفيذية، وضبط الجودة الفنية والتطوير."
        actions={
          <Button variant="primary" icon={Plus} size="sm" onClick={() => setIsAddOpen(true)}>
            إضافة مهندس
          </Button>
        }
      />

      <DepartmentSummary
        departmentTitle="إدارة المكتب الفني والهندسي"
        selectedMonth={selectedMonth}
        managerName={managerName}
        onManagerNameChange={setManagerName}
        accentColor="blue"
      />

      {/* Quick Metrics Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <GlassCard style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ color: 'var(--color-primary)', background: 'var(--color-primary-bg)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <FileCode size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>المخططات المعتمدة</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>42 مخطط</div>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ color: 'var(--color-success)', background: 'var(--color-success-bg)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <CheckCircle size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>مطابقة المواصفات</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>96.5%</div>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ color: 'var(--color-cyan)', background: 'var(--color-cyan-bg)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <Clock size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>متوسط وقت الإنجاز</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>1.5 يوم</div>
          </div>
        </GlassCard>
      </div>

      <KpiPanel
        accentColor="blue"
        kpis={[
          { key: 'speed', label: 'سرعة التنفيذ وإعداد الرسومات', value: kpis.speed, color: 'blue' },
          { key: 'lowErrors', label: 'دقة المخططات وقلة الأخطاء', value: kpis.lowErrors, color: 'green' },
          { key: 'development', label: 'تطوير أساليب العمل الهندسية', value: kpis.development, color: 'purple' }
        ]}
        onKpiChange={handleKpiChange}
      />

      {/* Engineers Section */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
              فريق مهندسي المكتب الفني ({engineers.length})
            </h3>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
              متابعة الأخطاء المسجلة وتوزيع الماكينات المسندة لكل مهندس
            </span>
          </div>
        </div>

        {engineers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="لا يوجد مهندسون مسجلون"
            description="يمكنك البدء بإضافة مهندس جديد لفريق المكتب الفني لمتابعة أدائه."
            actionLabel="إضافة مهندس جديد"
            onAction={() => setIsAddOpen(true)}
          />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem'
          }}>
            {engineers.map((eng) => (
              <TeamMemberCard
                key={eng.id}
                member={eng}
                onDelete={(id) => setDeleteTargetId(id)}
                roleLabel="مهندس مكتب فني"
                accentColor="blue"
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="إضافة مهندس جديد للمكتب الفني"
      >
        <form onSubmit={handleAddEngineer}>
          <TextField
            label="اسم المهندس"
            placeholder="مثال: م. أحمد عبد الرحمن"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            autoFocus
          />
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <Button variant="ghost" onClick={() => setIsAddOpen(false)}>
              إلغاء
            </Button>
            <Button variant="primary" type="submit">
              حفظ الإضافة
            </Button>
          </div>
        </form>
      </Modal>

      {/* Accessible Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={confirmDelete}
        title="حذف مهندس"
        message="هل أنت متأكد من رغبتك في حذف هذا المهندس من قائمة المكتب الفني؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="تأكيد الحذف"
        cancelText="تراجع"
        isDestructive
      />
    </PageContainer>
  );
}
