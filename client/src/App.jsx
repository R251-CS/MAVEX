import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { useAuth, getDepartmentRoute } from './context/AuthContext';

// Lazy load pages for performance & instant loading
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const TechnicalOffice = lazy(() => import('./pages/TechnicalOffice/TechnicalOffice'));
const Production = lazy(() => import('./pages/Production/Production'));
const PlanningWarehouse = lazy(() => import('./pages/PlanningWarehouse/PlanningWarehouse'));
const Maintenance = lazy(() => import('./pages/Maintenance/Maintenance'));
const Finance = lazy(() => import('./pages/Finance/Finance'));
const Quality = lazy(() => import('./pages/Quality/Quality'));
const Safety = lazy(() => import('./pages/Safety/Safety'));
const ViolationsAdmin = lazy(() => import('./pages/ViolationsAdmin/ViolationsAdmin'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));

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

// دالة توجيه الصفحة الرئيسية: الأدمن يرى لوحة التحكم العامة، بينما كل قسم يوجّه لقسمه الخاص فقط
function HomeRoute() {
  const { profile } = useAuth();
  if (profile?.role === 'admin') {
    return <Dashboard />;
  }
  const targetRoute = getDepartmentRoute(profile?.departmentId);
  return <Navigate to={targetRoute} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes - Verified authentication wrapper */}
          <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
            <Route path="/" element={<HomeRoute />} />

            <Route 
              path="/technical-office" 
              element={
                <ProtectedRoute requiredDepartment="technical_office">
                  <TechnicalOffice />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/production" 
              element={
                <ProtectedRoute requiredDepartment="production">
                  <Production />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/planning-warehouse" 
              element={
                <ProtectedRoute requiredDepartment="planning_warehouse">
                  <PlanningWarehouse />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/maintenance" 
              element={
                <ProtectedRoute requiredDepartment="maintenance">
                  <Maintenance />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/finance" 
              element={
                <ProtectedRoute requiredDepartment="finance">
                  <Finance />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/quality" 
              element={
                <ProtectedRoute requiredDepartment="quality">
                  <Quality />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/safety" 
              element={
                <ProtectedRoute requiredDepartment="safety">
                  <Safety />
                </ProtectedRoute>
              } 
            />

            {/* Admin-only restricted section */}
            <Route 
              path="/violations-admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ViolationsAdmin />
                </ProtectedRoute>
              } 
            />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

