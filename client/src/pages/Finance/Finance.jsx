import React, { useState, useEffect } from 'react';
import { useMonth } from '../../context/MonthContext';
import { PageContainer, PageHeader, GlassCard, Button, StatusBadge, DataTable, Modal, TextField } from '../../components/common';
import { 
  DollarSign, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Plus, 
  Users, 
  Building2, 
  Receipt, 
  Wallet, 
  CreditCard,
  Briefcase,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { useToast } from '../../components/common/Toast';

export default function Finance() {
  const { selectedMonth } = useMonth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('transactions'); // 'transactions' | 'parties' | 'payroll'

  // FR-20, FR-21, FR-22: Transactions
  const [transactions, setTransactions] = useState([
    {
      id: 'tx-1',
      type: 'IN',
      amount: 280000,
      category: 'تحصيل دفعات عملاء',
      partyName: 'شركة المقاولون العرب',
      partyId: 'party-1',
      description: 'دفعة إنجاز تصنيع هياكل محطة التحلية بموجب مستخلص #3',
      reference: 'INV-2026-112',
      paymentMethod: 'تحويل بنكي (CIB)',
      date: '2026-10-14'
    },
    {
      id: 'tx-2',
      type: 'OUT',
      amount: 150000,
      category: 'سداد مستحقات موردين',
      partyName: 'شركة حديد عز',
      partyId: 'party-3',
      description: 'دفعة سداد فاتورة توريد صاج 3 مم دفعة شهر أكتوبر',
      reference: 'BILL-EZZ-904',
      paymentMethod: 'شيك مصرفي مقاصة',
      date: '2026-10-13'
    },
    {
      id: 'tx-3',
      type: 'IN',
      amount: 350000,
      category: 'تحصيل دفعات عملاء',
      partyName: 'مجموعة السويدي إليكتريك',
      partyId: 'party-2',
      description: 'دفعة تعاقد مقدمة لتوريد كبائن التوزيع المعزولة',
      reference: 'INV-2026-115',
      paymentMethod: 'تحويل بنكي (QNB)',
      date: '2026-10-11'
    },
    {
      id: 'tx-4',
      type: 'OUT',
      amount: 45000,
      category: 'مصروفات تشغيل ومستلزمات',
      partyName: 'الشركة الدولية للغازات الصناعية',
      partyId: 'party-4',
      description: 'تعبئة أسطوانات غاز النيتروجين لماكينات الليزر الصناعي',
      reference: 'BILL-GAS-44',
      paymentMethod: 'تحويل فوري',
      date: '2026-10-10'
    }
  ]);

  // FR-19: Customers & Suppliers
  const [parties, setParties] = useState([
    {
      id: 'party-1',
      name: 'شركة المقاولون العرب للصناعات المعدنية',
      type: 'customer',
      phone: '+20 100 234 5678',
      email: 'orders@arabcont.com',
      balance: 420000,
      status: 'active',
      commercialReg: '48201-GZ'
    },
    {
      id: 'party-2',
      name: 'مجموعة السويدي إليكتريك للتصنيع',
      type: 'customer',
      phone: '+20 101 987 6543',
      email: 'procurement@elsewedy.com',
      balance: 680000,
      status: 'active',
      commercialReg: '19842-CA'
    },
    {
      id: 'party-3',
      name: 'شركة حديد عز للصناعات المتطورة',
      type: 'supplier',
      phone: '+20 102 334 4556',
      email: 'sales@ezzsteel.com',
      balance: -250000,
      status: 'active',
      commercialReg: '88310-AL'
    },
    {
      id: 'party-4',
      name: 'الشركة الدولية للغازات والمستلزمات الصناعية',
      type: 'supplier',
      phone: '+20 109 887 7665',
      email: 'support@intlgases.com',
      balance: -45000,
      status: 'active',
      commercialReg: '77412-CA'
    }
  ]);

  // FR-17, FR-18: Consolidated Payroll
  const [payrolls, setPayrolls] = useState([
    { id: 'p-1', name: 'م. أحمد حسن', department: 'المكتب الفني', title: 'رئيس قسم التصميم', basicSalary: 9500, incentives: 2500, deductions: 0, netSalary: 12000 },
    { id: 'p-2', name: 'م. سامح عزت', department: 'إدارة الإنتاج', title: 'مدير الإنتاج', basicSalary: 8800, incentives: 2000, deductions: 200, netSalary: 10600 },
    { id: 'p-3', name: 'م. طارق محمود', department: 'مراقبة الجودة', title: 'مدير الجودة', basicSalary: 8500, incentives: 2200, deductions: 0, netSalary: 10700 },
    { id: 'p-4', name: 'م. ياسر عبد الله', department: 'الصيانة والتشغيل', title: 'مهندس أول صيانة', basicSalary: 8200, incentives: 1800, deductions: 0, netSalary: 10000 },
    { id: 'p-5', name: 'أ. محمود فوزي', department: 'السلامة والصحة', title: 'أخصائي سلامة', basicSalary: 7500, incentives: 1500, deductions: 150, netSalary: 8850 },
    { id: 'p-6', name: 'فني محمود علي', department: 'الإنتاج', title: 'فني تشغيل ثناية', basicSalary: 5500, incentives: 1200, deductions: 0, netSalary: 6700 },
    { id: 'p-7', name: 'فني إبراهيم صابر', department: 'الإنتاج', title: 'فني قص ليزر', basicSalary: 5800, incentives: 1400, deductions: 100, netSalary: 7100 }
  ]);

  // Modal: New Transaction
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [txType, setTxType] = useState('IN'); // 'IN' | 'OUT'
  const [txForm, setTxForm] = useState({
    amount: '',
    category: '',
    partyName: '',
    description: '',
    reference: '',
    paymentMethod: 'تحويل بنكي'
  });

  // Modal: New Party
  const [isPartyModalOpen, setIsPartyModalOpen] = useState(false);
  const [partyForm, setPartyForm] = useState({
    name: '',
    type: 'customer',
    phone: '',
    email: '',
    balance: ''
  });

  // Fetch live finance data
  useEffect(() => {
    fetch('/api/v1/finance/transactions', { headers: { 'x-dev-user': '1' } })
      .then(r => r.json())
      .then(res => {
        if (res?.data?.transactions && res.data.transactions.length > 0) {
          setTransactions(res.data.transactions);
        }
      })
      .catch(() => {});

    fetch('/api/v1/finance/parties', { headers: { 'x-dev-user': '1' } })
      .then(r => r.json())
      .then(res => {
        if (res?.data?.parties && res.data.parties.length > 0) {
          setParties(res.data.parties);
        }
      })
      .catch(() => {});

    fetch('/api/v1/finance/payroll', { headers: { 'x-dev-user': '1' } })
      .then(r => r.json())
      .then(res => {
        if (res?.data?.payroll && res.data.payroll.length > 0) {
          setPayrolls(res.data.payroll);
        }
      })
      .catch(() => {});
  }, []);

  // Totals
  const totalIn = transactions.filter(t => t.type === 'IN').reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const totalOut = transactions.filter(t => t.type === 'OUT').reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const netCash = totalIn - totalOut;

  const openTxDialog = (type) => {
    setTxType(type);
    setTxForm({
      amount: '',
      category: type === 'IN' ? 'تحصيل دفعات عملاء' : 'سداد مستحقات موردين',
      partyName: '',
      description: '',
      reference: '',
      paymentMethod: 'تحويل بنكي'
    });
    setIsTxModalOpen(true);
  };

  const handleSaveTransaction = (e) => {
    e.preventDefault();
    const amount = Number(txForm.amount);
    if (!amount || amount <= 0) {
      addToast('يرجى إدخال مبلغ مالي صحيح', 'error');
      return;
    }

    const newTx = {
      id: `tx-${Date.now()}`,
      type: txType,
      amount,
      category: txForm.category.trim() || (txType === 'IN' ? 'إيرادات عامة' : 'مصروفات عامة'),
      partyName: txForm.partyName.trim() || 'طرف عام',
      description: txForm.description.trim() || (txType === 'IN' ? 'تحصيل وارد' : 'سداد منصرف'),
      reference: txForm.reference.trim() || `REF-${Date.now().toString().slice(-4)}`,
      paymentMethod: txForm.paymentMethod,
      date: new Date().toISOString().slice(0, 10)
    };

    setTransactions(prev => [newTx, ...prev]);

    // Send to backend
    fetch('/api/v1/finance/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-dev-user': '1' },
      body: JSON.stringify(newTx)
    }).catch(() => {});

    setIsTxModalOpen(false);
    addToast(txType === 'IN' ? 'تم تسجيل الوارد المالي بنجاح' : 'تم تسجيل المنصرف المالي بنجاح', 'success');
  };

  const handleSaveParty = (e) => {
    e.preventDefault();
    if (!partyForm.name.trim()) return;

    const newP = {
      id: `party-${Date.now()}`,
      name: partyForm.name.trim(),
      type: partyForm.type,
      phone: partyForm.phone.trim(),
      email: partyForm.email.trim(),
      balance: Number(partyForm.balance) || 0,
      status: 'active'
    };

    setParties(prev => [newP, ...prev]);

    fetch('/api/v1/finance/parties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-dev-user': '1' },
      body: JSON.stringify(newP)
    }).catch(() => {});

    setIsPartyModalOpen(false);
    setPartyForm({ name: '', type: 'customer', phone: '', email: '', balance: '' });
    addToast('تمت إضافة جهة التعامل بنجاح', 'success');
  };

  // Transaction columns
  const txColumns = [
    {
      header: 'النوع',
      accessor: 'type',
      width: '110px',
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
          {r.type === 'IN' ? 'وارد (+)' : 'منصرف (-)'}
        </span>
      )
    },
    {
      header: 'المبلغ المالي',
      accessor: 'amount',
      width: '140px',
      render: (r) => (
        <strong style={{ fontSize: '1rem', color: r.type === 'IN' ? 'var(--color-success)' : 'var(--accent-red)' }}>
          {r.type === 'IN' ? '+' : '-'}{Number(r.amount).toLocaleString()} ج.م
        </strong>
      )
    },
    {
      header: 'الطرف والبيان',
      accessor: 'description',
      render: (r) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{r.partyName}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{r.description}</span>
        </div>
      )
    },
    {
      header: 'التصنيف وطريقة السداد',
      accessor: 'category',
      width: '180px',
      render: (r) => (
        <div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-primary)' }}>{r.category}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{r.paymentMethod}</span>
        </div>
      )
    },
    {
      header: 'التاريخ والمرجع',
      accessor: 'date',
      width: '140px',
      render: (r) => (
        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          <div>{r.date}</div>
          <span style={{ color: 'var(--color-primary)' }}>{r.reference}</span>
        </div>
      )
    }
  ];

  // Parties columns
  const partyColumns = [
    {
      header: 'النوع',
      accessor: 'type',
      width: '100px',
      render: (r) => (
        <StatusBadge status={r.type === 'customer' ? 'info' : 'warning'} size="sm">
          {r.type === 'customer' ? 'عميل' : 'مورد'}
        </StatusBadge>
      )
    },
    {
      header: 'اسم الشركة / الجهة',
      accessor: 'name',
      render: (r) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{r.name}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{r.email} | {r.phone}</span>
        </div>
      )
    },
    {
      header: 'الرصيد المالي الحالي',
      accessor: 'balance',
      width: '160px',
      render: (r) => {
        const bal = Number(r.balance);
        const isReceivable = bal >= 0;
        return (
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: isReceivable ? 'var(--color-success)' : 'var(--accent-red)' }}>
              {Math.abs(bal).toLocaleString()} ج.م
            </span>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
              {isReceivable ? '(مستحق لنا)' : '(مستحق للطرف)'}
            </div>
          </div>
        );
      }
    }
  ];

  // Payroll columns
  const payrollColumns = [
    {
      header: 'اسم الموظف / العامل',
      accessor: 'name',
      render: (r) => (
        <div>
          <strong style={{ color: 'var(--color-text-primary)' }}>{r.name}</strong>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{r.title} | {r.department}</div>
        </div>
      )
    },
    {
      header: 'الراتب الأساسي (FR-18)',
      accessor: 'basicSalary',
      render: (r) => <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{Number(r.basicSalary).toLocaleString()} ج.م</span>
    },
    {
      header: 'الحوافز والمكافآت (FR-18)',
      accessor: 'incentives',
      render: (r) => <span style={{ fontWeight: 700, color: 'var(--color-success)' }}>+{Number(r.incentives).toLocaleString()} ج.م</span>
    },
    {
      header: 'الاستقطاعات',
      accessor: 'deductions',
      render: (r) => <span style={{ fontWeight: 700, color: r.deductions > 0 ? 'var(--accent-red)' : 'var(--color-text-muted)' }}>-{Number(r.deductions || 0).toLocaleString()} ج.م</span>
    },
    {
      header: 'صافي الراتب المستحق (FR-17)',
      accessor: 'netSalary',
      render: (r) => (
        <strong style={{ fontSize: '1rem', color: 'var(--accent-blue)' }}>
          {Number(r.netSalary || (r.basicSalary + r.incentives - (r.deductions || 0))).toLocaleString()} ج.م
        </strong>
      )
    }
  ];

  return (
    <PageContainer>
      <PageHeader
        title="الإدارة المالية والحسابات (Financial Management)"
        description="تسجيل ومتابعة الأموال الداخلة والخارجة، كشف حركة المعاملات، أرصدة العملاء والموردين ومسيرات الرواتب."
        actions={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="primary" icon={Plus} size="sm" onClick={() => openTxDialog('IN')}>
              تسجيل وارد مالي (+)
            </Button>
            <Button variant="secondary" icon={ArrowUpRight} size="sm" onClick={() => openTxDialog('OUT')}>
              تسجيل منصرف (-)
            </Button>
            <Button variant="secondary" icon={Users} size="sm" onClick={() => setIsPartyModalOpen(true)}>
              إضافة عميل / مورد
            </Button>
          </div>
        }
      />

      {/* Summary KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <GlassCard style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ color: 'var(--color-success)', background: 'var(--color-success-bg)', padding: '0.6rem', borderRadius: 'var(--radius-md)' }}>
            <ArrowDownLeft size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>إجمالي الأموال الداخلة (الوارد)</span>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-success)' }}>
              +{totalIn.toLocaleString()} ج.م
            </div>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ color: 'var(--accent-red)', background: 'rgba(239, 68, 68, 0.12)', padding: '0.6rem', borderRadius: 'var(--radius-md)' }}>
            <ArrowUpRight size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>إجمالي الأموال الخارجة (المنصرف)</span>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-red)' }}>
              -{totalOut.toLocaleString()} ج.م
            </div>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ color: 'var(--color-primary)', background: 'var(--color-primary-bg)', padding: '0.6rem', borderRadius: 'var(--radius-md)' }}>
            <Wallet size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>صافي الحركة والسيولة</span>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary)' }}>
              {netCash >= 0 ? '+' : ''}{netCash.toLocaleString()} ج.م
            </div>
          </div>
        </GlassCard>
      </div>

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
          onClick={() => setActiveTab('transactions')}
          style={{
            padding: '0.6rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'transactions' ? '2px solid var(--accent-blue)' : '2px solid transparent',
            color: activeTab === 'transactions' ? 'var(--accent-blue)' : 'var(--color-text-secondary)',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Receipt size={16} /> حركة الأموال والمعاملات ({transactions.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('parties')}
          style={{
            padding: '0.6rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'parties' ? '2px solid var(--accent-blue)' : '2px solid transparent',
            color: activeTab === 'parties' ? 'var(--accent-blue)' : 'var(--color-text-secondary)',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Building2 size={16} /> سجل العملاء والموردين ({parties.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('payroll')}
          style={{
            padding: '0.6rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'payroll' ? '2px solid var(--accent-blue)' : '2px solid transparent',
            color: activeTab === 'payroll' ? 'var(--accent-blue)' : 'var(--color-text-secondary)',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <FileSpreadsheet size={16} /> كشف رواتب وحوافز العمال ({payrolls.length})
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'transactions' && (
        <DataTable
          columns={txColumns}
          data={transactions}
          keyExtractor={(tx) => tx.id}
          searchPlaceholder="بحث في المعاملات المالية، الشركات، أو المراجع..."
          searchKeys={['partyName', 'description', 'reference', 'category']}
        />
      )}

      {activeTab === 'parties' && (
        <DataTable
          columns={partyColumns}
          data={parties}
          keyExtractor={(p) => p.id}
          searchPlaceholder="بحث في أسماء العملاء، الموردين، أو أرقام الهواتف..."
          searchKeys={['name', 'email', 'phone']}
        />
      )}

      {activeTab === 'payroll' && (
        <DataTable
          columns={payrollColumns}
          data={payrolls}
          keyExtractor={(pr) => pr.id}
          searchPlaceholder="بحث في كشف رواتب الموظفين..."
          searchKeys={['name', 'department', 'title']}
        />
      )}

      {/* Modal: New Transaction (FR-20, FR-21) */}
      <Modal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        title={txType === 'IN' ? 'تسجيل أموال داخلة (وارد مالي +)' : 'تسجيل أموال خارجة (منصرف مالي -)'}
      >
        <form onSubmit={handleSaveTransaction}>
          <TextField
            label="المبلغ المالي (ج.م)"
            type="number"
            placeholder="مثال: 50000"
            value={txForm.amount}
            onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })}
            required
            autoFocus
          />

          <TextField
            label="الطرف / الشركة المتعامل معها"
            placeholder="مثال: شركة المقاولون العرب أو شركة حديد عز"
            value={txForm.partyName}
            onChange={(e) => setTxForm({ ...txForm, partyName: e.target.value })}
            required
          />

          <TextField
            label="بيان المعاملة وتفاصيلها"
            placeholder="مثال: دفعة مستخلص أعمال أو سداد فاتورة توريد"
            value={txForm.description}
            onChange={(e) => setTxForm({ ...txForm, description: e.target.value })}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <TextField
              label="رقم المرجع / الفاتورة"
              placeholder="مثال: INV-2026-90"
              value={txForm.reference}
              onChange={(e) => setTxForm({ ...txForm, reference: e.target.value })}
            />
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
                طريقة الدفع
              </label>
              <select
                value={txForm.paymentMethod}
                onChange={(e) => setTxForm({ ...txForm, paymentMethod: e.target.value })}
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
                <option value="تحويل بنكي">تحويل بنكي</option>
                <option value="شيك بنكي">شيك بنكي</option>
                <option value="نقداً (خزينة المصنع)">نقداً (خزينة المصنع)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <Button variant="ghost" onClick={() => setIsTxModalOpen(false)}>إلغاء</Button>
            <Button variant="primary" type="submit">
              {txType === 'IN' ? 'تأكيد تسجيل الوارد' : 'تأكيد تسجيل المنصرف'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: New Party (FR-19) */}
      <Modal
        isOpen={isPartyModalOpen}
        onClose={() => setIsPartyModalOpen(false)}
        title="إضافة عميل أو مورد جديد"
      >
        <form onSubmit={handleSaveParty}>
          <TextField
            label="اسم الشركة أو الجهة"
            placeholder="مثال: شركة النيل للصلب"
            value={partyForm.name}
            onChange={(e) => setPartyForm({ ...partyForm, name: e.target.value })}
            required
            autoFocus
          />

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
              نوع جهة التعامل
            </label>
            <select
              value={partyForm.type}
              onChange={(e) => setPartyForm({ ...partyForm, type: e.target.value })}
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
              <option value="customer">عميل (زبون)</option>
              <option value="supplier">مورد خامات وخدمات</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <TextField
              label="رقم الهاتف"
              placeholder="+20 100 000 0000"
              value={partyForm.phone}
              onChange={(e) => setPartyForm({ ...partyForm, phone: e.target.value })}
            />
            <TextField
              label="الرصيد الافتتاحي (ج.م)"
              type="number"
              placeholder="0"
              value={partyForm.balance}
              onChange={(e) => setPartyForm({ ...partyForm, balance: e.target.value })}
            />
          </div>

          <TextField
            label="البريد الإلكتروني"
            type="email"
            placeholder="info@company.com"
            value={partyForm.email}
            onChange={(e) => setPartyForm({ ...partyForm, email: e.target.value })}
          />

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <Button variant="ghost" onClick={() => setIsPartyModalOpen(false)}>إلغاء</Button>
            <Button variant="primary" type="submit">إضافة جهة التعامل</Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}
