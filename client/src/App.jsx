import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout';
import Dashboard from './pages/Dashboard/Dashboard';
import TechnicalOffice from './pages/TechnicalOffice/TechnicalOffice';
import Production from './pages/Production/Production';
import Quality from './pages/Quality/Quality';
import PlanningWarehouse from './pages/PlanningWarehouse/PlanningWarehouse';
import Maintenance from './pages/Maintenance/Maintenance';
import Safety from './pages/Safety/Safety';
import ViolationsAdmin from './pages/ViolationsAdmin/ViolationsAdmin';
import NotFound from './pages/NotFound/NotFound';
import Login from './pages/Auth/Login';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<AppShell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/technical-office" element={<TechnicalOffice />} />
          <Route path="/production" element={<Production />} />
          <Route path="/quality" element={<Quality />} />
          <Route path="/planning-warehouse" element={<PlanningWarehouse />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/violations-admin" element={<ViolationsAdmin />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
