import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { CheckCircle2, ShieldAlert, AlertOctagon } from 'lucide-react';

// Lazy load pages for performance & instant loading
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const TechnicalOffice = lazy(() => import('./pages/TechnicalOffice/TechnicalOffice'));
const Production = lazy(() => import('./pages/Production/Production'));
const PlanningWarehouse = lazy(() => import('./pages/PlanningWarehouse/PlanningWarehouse'));
const Maintenance = lazy(() => import('./pages/Maintenance/Maintenance'));
const Finance = lazy(() => import('./pages/Finance/Finance'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const ComingSoon = lazy(() => import('./pages/ComingSoon/ComingSoon'));

const PageLoader = () => (
  <div style={{
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    height: '100vh', backgroundColor: '#0a0f1d'
  }}>
    <div style={{
      width: '36px', height: '36px', borderRadius: '50%',
      border: '3px solid rgba(59,130,246,0.2)', borderTopColor: '#3b82f6',
      animation: 'spin 0.8s linear infinite'
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes - ProtectedRoute يتحقق من المصادقة ثم يعرض AppShell */}
          <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/technical-office" element={<TechnicalOffice />} />
            <Route path="/production" element={<Production />} />
            <Route path="/planning-warehouse" element={<PlanningWarehouse />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/finance" element={<Finance />} />

            {/* Disabled sections - show Coming Soon */}
            <Route path="/quality" element={<ComingSoon title="مراقبة الجودة" icon={CheckCircle2} />} />
            <Route path="/safety" element={<ComingSoon title="السلامة والصحة المهنية" icon={ShieldAlert} />} />
            <Route path="/violations-admin" element={<ComingSoon title="إدارة المخالفات" icon={AlertOctagon} />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
