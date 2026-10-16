import React, { useState, useEffect } from 'react';
import { useMonth } from '../../context/MonthContext';
import { PageContainer, PageHeader, GlassCard, Button, StatusBadge, DataTable, Modal, TextField } from '../../components/common';
import { DepartmentSummary } from '../../components/departments/DepartmentSummary';
import { KpiPanel } from '../../components/departments/KpiPanel';
import { 
  Boxes, 
  PackageCheck, 
  Truck, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Plus, 
  Minus, 
  History, 
  AlertCircle,
  Layers,
  Archive
} from 'lucide-react';
import { useToast } from '../../components/common/Toast';

export default function PlanningWarehouse() {
  const { selectedMonth } = useMonth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('stock'); // 'stock' | 'movements' | 'shipments'
  const [managerName, setManagerName] = useState('أ. خالد السيد');

  const [kpis, setKpis] = useState({
    planning: 85,
    stock: 94,
    turnaround: 88
  });

  // FR-15: Available items & stock
  const [items, setItems] = useState([
    { id: 'item-1', code: 'RAW-ST-01', name: 'ألواح صاج مسحوب على الساخن 3 مم', category: 'خامات صاج وحديد', unit: 'طن', quantity: 42, minThreshold: 15, location: 'عنبر أ - رصيف 4' },
    { id: 'item-2', code: 'RAW-ST-02', name: 'ألواح صاج مجلفن 2 مم عالي المتانة', category: 'خامات صاج وحديد', unit: 'طن', quantity: 28, minThreshold: 10, location: 'عنبر أ - رصيف 2' },
    { id: 'item-3', code: 'CHM-PNT-01', name: 'مسحوق دهان بودرة إلكتروستاتيك RAL-7035', category: 'دهانات وتشطيب', unit: 'كجم', quantity: 650, minThreshold: 200, location: 'مخزن الكيماويات والدهانات' },
    { id: 'item-4', code: 'GAS-N2-01', name: 'غاز نيتروجين عالي النقاوة للقص بالليزر', category: 'غازات صناعية', unit: 'أسطوانة', quantity: 18, minThreshold: 5, location: 'محطة الغازات المركزية' },
    { id: 'item-5', code: 'FST-BOLT-01', name: 'مسامير ربط صلب M12 عالي الإجهاد', category: 'مثبتات ولوازم تجميع', unit: 'ألف قطعة', quantity: 14, minThreshold: 3, location: 'مخزن القطع التجميعية' }
  ]);

  // FR-16: Stock movements log
  const [movements, setMovements] = useState([
    {
      id: 'mov-1',
      itemId: 'item-1',
      itemName: 'ألواح صاج مسحوب على الساخن 3 مم',
      type: 'IN',
      quantity: 12,
      previousBalance: 30,
      newBalance: 42,
      reason: 'توريد جديد من مصانع حديد عز - إذن استلام #8801',
      referenceId: 'REC-8801',
      createdBy: 'أ. خالد السيد',
      createdAt: '2026-10-14 10:30'
    },
    {
      id: 'mov-2',
      itemId: 'item-2',
      itemName: 'ألواح صاج مجلفن 2 مم',
      type: 'OUT',
      quantity: 4,
      previousBalance: 32,
      newBalance: 28,
      reason: 'صرف خامات لأمر تصنيع كبائن التوزيع #WO-2026-101',
      referenceId: 'WO-2026-101',
      createdBy: 'أ. خالد السيد',
      createdAt: '2026-10-15 08:15'
    },
    {
      id: 'mov-3',
      itemId: 'item-3',
      itemName: 'مسحوق دهان بودرة إلكتروستاتيك',
      type: 'OUT',
      quantity: 50,
      previousBalance: 700,
      newBalance: 650,
      reason: 'صرف لكابينة الدهان الآلي للأمر #WO-2026-103',
      referenceId: 'WO-2026-103',
      createdBy: 'أ. خالد السيد',
      createdAt: '2026-10-15 11:45'
    }
  ]);

  const [shipments] = useState([
    { id: 'sh-1', code: 'PO-2026-88', item: 'ألواح صاج مجلفن 2 مم', qty: '45 طن', status: 'delivered', date: '2026-10-12' },
    { id: 'sh-2', code: 'PO-2026-91', item: 'مسامير ولوازم تثبيت هيكلي', qty: '12,000 قطعة', status: 'transit', date: '2026-10-14' },
    { id: 'sh-3', code: 'PO-2026-94', item: 'دهانات إلكتروستاتيك بودرة', qty: '800 كجم', status: 'delivered', date: '2026-10-09' }
  ]);

  // Movement Modal state (FR-14)
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [movementType, setMovementType] = useState('IN'); // 'IN' | 'OUT'
  const [movementForm, setMovementForm] = useState({
    itemId: 'item-1',
    quantity: '',
    reason: '',
    referenceId: ''
  });

  // Fetch live items and movements
  useEffect(() => {
    fetch('/api/v1/inventory/items', { headers: { 'x-dev-user': '1' } })
      .then(res => res.json())
      .then(res => {
        if (res?.data?.items && res.data.items.length > 0) setItems(res.data.items);
      })
      .catch(() => {});

    fetch('/api/v1/inventory/movements', { headers: { 'x-dev-user': '1' } })
      .then(res => res.json())
      .then(res => {
        if (res?.data?.movements && res.data.movements.length > 0) setMovements(res.data.movements);
      })
      .catch(() => {});
  }, []);

  const openMovementDialog = (type, defaultItemId = null) => {
    setMovementType(type);
    setMovementForm({
      itemId: defaultItemId || items[0]?.id || 'item-1',
      quantity: '',
      reason: '',
      referenceId: ''
    });
    setIsMovementModalOpen(true);
  };

  const handleSaveMovement = (e) => {
    e.preventDefault();
    const qty = Number(movementForm.quantity);
    if (!qty || qty <= 0) {
      addToast('يرجى إدخال كمية صحيحة أكبر من الصفر', 'error');
      return;
    }

    const item = items.find(i => i.id === movementForm.itemId);
    if (!item) return;

    if (movementType === 'OUT' && item.quantity < qty) {
      addToast(`الرصيد غير كافٍ للصرف! المتاح: ${item.quantity} ${item.unit}`, 'error');
      return;
    }

    const prevBal = item.quantity;
    const newBal = movementType === 'IN' ? prevBal + qty : prevBal - qty;

    // Update item stock locally
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity: newBal } : i));

    // Add movement record
    const newMov = {
      id: `mov-${Date.now()}`,
      itemId: item.id,
      itemName: item.name,
      type: movementType,
      quantity: qty,
      previousBalance: prevBal,
      newBalance: newBal,
      reason: movementForm.reason.trim() || (movementType === 'IN' ? 'إذن إضافة مخزنية واردة' : 'إذن صرف خامات للتشغيل'),
      referenceId: movementForm.referenceId.trim() || `REF-${Date.now().toString().slice(-4)}`,
      createdBy: managerName,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };

    setMovements(prev => [newMov, ...prev]);

    // Send to backend
    fetch('/api/v1/inventory/movements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-dev-user': '1' },
      body: JSON.stringify({
        itemId: item.id,
        warehouseId: 'wh-main',
        type: movementType,
        quantity: qty,
        reason: newMov.reason,
        referenceId: newMov.referenceId
      })
    }).catch(() => {});

    setIsMovementModalOpen(false);
    addToast(movementType === 'IN' ? 'تمت إضافة الكمية إلى رصيد المخزن' : 'تم صرف الكمية بنجاح وتسجيل الحركة', 'success');
  };

  const handleKpiChange = (key, value) => {
    setKpis(prev => ({ ...prev, [key]: value }));
  };

  // Stock Columns
  const stockColumns = [
    {
      header: 'كود الصنف',
      accessor: 'code',
      width: '120px',
      render: (r) => <strong style={{ color: 'var(--color-primary)' }}>{r.code}</strong>
    },
    {
      header: 'اسم الخامة / الصنف',
      accessor: 'name',
      render: (r) => (
        <div>
          <div style={{ color: 'var(--color-text-primary)', fontWeight: 700 }}>{r.name}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{r.category} | {r.location}</span>
        </div>
      )
    },
    {
      header: 'الرصيد المتاح',
      accessor: 'quantity',
      width: '140px',
      render: (r) => {
        const isLow = r.quantity <= r.minThreshold;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontWeight: 800, fontSize: '1.05rem', color: isLow ? 'var(--accent-red)' : 'var(--color-text-primary)' }}>
              {r.quantity.toLocaleString()} {r.unit}
            </span>
            {isLow && (
              <span title="تجاوز حد الأمان الأدنى" style={{ color: 'var(--accent-red)' }}>
                <AlertCircle size={14} />
              </span>
            )}
          </div>
        );
      }
    },
    {
      header: 'حد الأمان الأدنى',
      accessor: 'minThreshold',
      width: '120px',
      render: (r) => <span style={{ color: 'var(--color-text-muted)' }}>{r.minThreshold} {r.unit}</span>
    },
    {
      header: 'إجراءات سريعة',
      accessor: 'id',
      width: '160px',
      render: (r) => (
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button
            type="button"
            onClick={() => openMovementDialog('IN', r.id)}
            style={{
              padding: '0.25rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-success-border)',
              background: 'rgba(34, 197, 94, 0.1)',
              color: 'var(--color-success)',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem'
            }}
          >
            <Plus size={12} /> إضافة
          </button>
          <button
            type="button"
            onClick={() => openMovementDialog('OUT', r.id)}
            style={{
              padding: '0.25rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-danger-border)',
              background: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--color-danger)',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem'
            }}
          >
            <Minus size={12} /> صرف
          </button>
        </div>
      )
    }
  ];

  // Movements Columns
  const movementColumns = [
    {
      header: 'النوع',
      accessor: 'type',
      width: '90px',
      render: (r) => (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          padding: '0.2rem 0.5rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.75rem',
          fontWeight: 800,
          background: r.type === 'IN' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          color: r.type === 'IN' ? 'var(--color-success)' : 'var(--color-danger)'
        }}>
          {r.type === 'IN' ? <ArrowDownLeft size={13} /> : <ArrowUpRight size={13} />}
          {r.type === 'IN' ? 'وارد +' : 'منصرف -'}
        </span>
      )
    },
    {
      header: 'الصنف / المادة',
      accessor: 'itemName',
      render: (r) => <strong style={{ color: 'var(--color-text-primary)' }}>{r.itemName}</strong>
    },
    {
      header: 'الكمية',
      accessor: 'quantity',
      width: '100px',
      render: (r) => <strong style={{ color: r.type === 'IN' ? 'var(--color-success)' : 'var(--accent-red)' }}>{r.quantity}</strong>
    },
    {
      header: 'الرصيد قبل / بعد',
      accessor: 'newBalance',
      width: '140px',
      render: (r) => (
        <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
          {r.previousBalance} ➔ <strong style={{ color: 'var(--color-text-primary)' }}>{r.newBalance}</strong>
        </span>
      )
    },
    {
      header: 'السبب / المرجع',
      accessor: 'reason',
      render: (r) => (
        <div>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.8125rem' }}>{r.reason}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>مرجع: {r.referenceId}</span>
        </div>
      )
    },
    {
      header: 'التاريخ والمستخدم',
      accessor: 'createdAt',
      width: '140px',
      render: (r) => (
        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          <div>{r.createdAt}</div>
          <span style={{ color: 'var(--accent-purple)' }}>{r.createdBy}</span>
        </div>
      )
    }
  ];

  return (
    <PageContainer>
      <PageHeader
        title="التخطيط والمستودعات (Planning & Warehouse)"
        description="إدارة الخامات، مراقبة الكميات المتاحة، تسجيل حركات الإضافة والصرف المخزني وسلاسل التوريد."
        actions={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="primary" icon={Plus} size="sm" onClick={() => openMovementDialog('IN')}>
              إذن إضافة خامات (+)
            </Button>
            <Button variant="secondary" icon={Minus} size="sm" onClick={() => openMovementDialog('OUT')}>
              إذن صرف تشغيل (-)
            </Button>
          </div>
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <GlassCard style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ color: 'var(--color-violet)', background: 'var(--color-violet-bg)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <Boxes size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>الأصناف المخزنة</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>{items.length} أصناف رئيسية</div>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ color: 'var(--color-success)', background: 'var(--color-success-bg)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <ArrowDownLeft size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>حركات الوارد المسجلة</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
              {movements.filter(m => m.type === 'IN').length} أذون إضافة
            </div>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ color: 'var(--accent-red)', background: 'rgba(239, 68, 68, 0.12)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <ArrowUpRight size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>حركات الصرف والتشغيل</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
              {movements.filter(m => m.type === 'OUT').length} أذون صرف
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '1.5rem',
        paddingBottom: '0.25rem'
      }}>
        <button
          type="button"
          onClick={() => setActiveTab('stock')}
          style={{
            padding: '0.6rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'stock' ? '2px solid var(--accent-purple)' : '2px solid transparent',
            color: activeTab === 'stock' ? 'var(--accent-purple)' : 'var(--color-text-secondary)',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Archive size={16} /> الأرصدة والكميات المتاحة ({items.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('movements')}
          style={{
            padding: '0.6rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'movements' ? '2px solid var(--accent-purple)' : '2px solid transparent',
            color: activeTab === 'movements' ? 'var(--accent-purple)' : 'var(--color-text-secondary)',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <History size={16} /> سجل حركات المخزون والوارد والمنصرف ({movements.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('shipments')}
          style={{
            padding: '0.6rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'shipments' ? '2px solid var(--accent-purple)' : '2px solid transparent',
            color: activeTab === 'shipments' ? 'var(--accent-purple)' : 'var(--color-text-secondary)',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Truck size={16} /> شحنات وسلاسل التوريد
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'stock' && (
        <DataTable
          columns={stockColumns}
          data={items}
          keyExtractor={(item) => item.id}
          searchPlaceholder="بحث في الأصناف، الخامات، أو مواقع التخزين..."
          searchKeys={['name', 'code', 'category', 'location']}
        />
      )}

      {activeTab === 'movements' && (
        <DataTable
          columns={movementColumns}
          data={movements}
          keyExtractor={(mov) => mov.id}
          searchPlaceholder="بحث في حركات الإضافة والصرف أو الأسباب..."
          searchKeys={['itemName', 'reason', 'referenceId', 'createdBy']}
        />
      )}

      {activeTab === 'shipments' && (
        <DataTable
          columns={[
            { header: 'رقم الإذن', accessor: 'code', render: (r) => <strong style={{ color: 'var(--color-primary)' }}>{r.code}</strong> },
            { header: 'الصنف / المادة الخام', accessor: 'item', render: (r) => <span style={{ fontWeight: 600 }}>{r.item}</span> },
            { header: 'الكمية المستلمة', accessor: 'qty' },
            { header: 'تاريخ الورود', accessor: 'date' },
            {
              header: 'حالة الاستلام',
              accessor: 'status',
              render: (r) => (
                <StatusBadge status={r.status === 'delivered' ? 'success' : 'warning'} size="sm">
                  {r.status === 'delivered' ? 'تم الاستلام والفحص' : 'قيد الشحن والتوريد'}
                </StatusBadge>
              )
            }
          ]}
          data={shipments}
          keyExtractor={(sh) => sh.id}
        />
      )}

      {/* Modal: Record Inbound/Outbound Movement (FR-14) */}
      <Modal
        isOpen={isMovementModalOpen}
        onClose={() => setIsMovementModalOpen(false)}
        title={movementType === 'IN' ? 'إذن إضافة مخزنية واردة (+)' : 'إذن صرف خامات وتشغيل (-)'}
      >
        <form onSubmit={handleSaveMovement}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
              الصنف / المادة الخام
            </label>
            <select
              value={movementForm.itemId}
              onChange={(e) => setMovementForm({ ...movementForm, itemId: e.target.value })}
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
              {items.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name} (الرصيد المتاح: {item.quantity} {item.unit})
                </option>
              ))}
            </select>
          </div>

          <TextField
            label={`الكمية المراد ${movementType === 'IN' ? 'إضافتها' : 'صرفها'}`}
            type="number"
            placeholder="مثال: 5"
            value={movementForm.quantity}
            onChange={(e) => setMovementForm({ ...movementForm, quantity: e.target.value })}
            required
            autoFocus
          />

          <TextField
            label="السبب أو الغرض من الحركة"
            placeholder={movementType === 'IN' ? 'مثال: توريد دفعة حديد عز رقم #901' : 'مثال: صرف لأمر تشغيل ليزر رقم #WO-101'}
            value={movementForm.reason}
            onChange={(e) => setMovementForm({ ...movementForm, reason: e.target.value })}
            required
          />

          <TextField
            label="رقم المرجع أو الإذن (Reference)"
            placeholder="مثال: PO-8842 أو REC-102"
            value={movementForm.referenceId}
            onChange={(e) => setMovementForm({ ...movementForm, referenceId: e.target.value })}
          />

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <Button variant="ghost" onClick={() => setIsMovementModalOpen(false)}>إلغاء</Button>
            <Button variant="primary" type="submit">
              {movementType === 'IN' ? 'تأكيد الإضافة للرصيد' : 'تأكيد الصرف المخزني'}
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}
