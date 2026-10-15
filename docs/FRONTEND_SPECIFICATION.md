# MAVEX Frontend Architecture & Technical Specification

## 1. System Overview
The MAVEX Frontend is an industrial operations management system built with **React 18**, **Vite**, and **Vanilla CSS Design Tokens**. The system provides real-time KPI monitoring, department-level operation management, and executive overviews across 7 industrial departments.

---

## 2. Design System & Theme Engine

### 2.1 Dual Theme Tokens (`[data-theme="dark" | "light"]`)
- Complete color palette supporting seamless switching without CSS flicker (handled by inline head execution script).
- **Glassmorphism**: Multi-layered translucent surfaces utilizing `backdrop-filter: blur(12px)`.
- **RTL-First**: Built with logical CSS properties (`padding-inline`, `margin-inline`, `inset-inline-start`) and Cairo Arabic typography.

### 2.2 Reusable Component Library (`src/components/common/`)
- [Button](file:///d:/R-WORK/MAVEX/client/src/components/common/Button.jsx) (`primary`, `secondary`, `ghost`, `danger`, `loading`)
- [IconButton](file:///d:/R-WORK/MAVEX/client/src/components/common/IconButton.jsx) (Accessible icon actions)
- [GlassCard](file:///d:/R-WORK/MAVEX/client/src/components/common/GlassCard.jsx) (Interactive, glowing borders, hover reactions)
- [Modal](file:///d:/R-WORK/MAVEX/client/src/components/common/Modal.jsx) & [ConfirmDialog](file:///d:/R-WORK/MAVEX/client/src/components/common/ConfirmDialog.jsx) (Accessible dialogs replacing `window.confirm`)
- [Toast](file:///d:/R-WORK/MAVEX/client/src/components/common/Toast.jsx) (`useToast` notification system)
- [KpiSlider](file:///d:/R-WORK/MAVEX/client/src/components/common/KpiSlider.jsx) (Dual-mode read-only / interactive slider)
- [DataTable](file:///d:/R-WORK/MAVEX/client/src/components/common/DataTable.jsx) (Structured data with loading skeletons)
- [StatusBadge](file:///d:/R-WORK/MAVEX/client/src/components/common/StatusBadge.jsx), [Skeleton](file:///d:/R-WORK/MAVEX/client/src/components/common/Skeleton.jsx), [EmptyState](file:///d:/R-WORK/MAVEX/client/src/components/common/EmptyState.jsx), [ErrorState](file:///d:/R-WORK/MAVEX/client/src/components/common/ErrorState.jsx)

---

## 3. Navigation & App Shell

### 3.1 App Shell Architecture (`src/components/layout/`)
- **[AppShell](file:///d:/R-WORK/MAVEX/client/src/components/layout/AppShell.jsx)**: Persistent application frame with responsive navigation.
- **[Sidebar](file:///d:/R-WORK/MAVEX/client/src/components/layout/Sidebar.jsx)**: Desktop permanent drawer and mobile off-canvas drawer with active route highlighting for all 8 departments.
- **[Header](file:///d:/R-WORK/MAVEX/client/src/components/layout/Header.jsx)**: Glassmorphic top bar containing system online status, global MonthPicker, and ThemeToggle.
- **[MobileNav](file:///d:/R-WORK/MAVEX/client/src/components/layout/MobileNav.jsx)**: Fast-access bottom bar on screen widths $\le 768$px.

---

## 4. Routing Table

| Route | Page | Component | Purpose |
|---|---|---|---|
| `/` | Dashboard | [Dashboard.jsx](file:///d:/R-WORK/MAVEX/client/src/pages/Dashboard/Dashboard.jsx) | Executive gauge, department performance grid & chart |
| `/technical-office` | Technical Office | [TechnicalOffice.jsx](file:///d:/R-WORK/MAVEX/client/src/pages/TechnicalOffice/TechnicalOffice.jsx) | KPI sliders, engineer management & error tracking |
| `/production` | Production | [Production.jsx](file:///d:/R-WORK/MAVEX/client/src/pages/Production/Production.jsx) | Line efficiency, technician rosters, machine assignments |
| `/quality` | Quality Assurance | [Quality.jsx](file:///d:/R-WORK/MAVEX/client/src/pages/Quality/Quality.jsx) | Acceptance KPIs, inspection logs & non-conformance reports |
| `/planning-warehouse` | Planning & Warehouse | [PlanningWarehouse.jsx](file:///d:/R-WORK/MAVEX/client/src/pages/PlanningWarehouse/PlanningWarehouse.jsx) | Material stock and production schedule placeholder |
| `/maintenance` | Maintenance & Ops | [Maintenance.jsx](file:///d:/R-WORK/MAVEX/client/src/pages/Maintenance/Maintenance.jsx) | Machine preventive and breakdown maintenance |
| `/safety` | HSE & Safety | [Safety.jsx](file:///d:/R-WORK/MAVEX/client/src/pages/Safety/Safety.jsx) | Work environment safety & compliance records |
| `/violations-admin` | Violations Admin | [ViolationsAdmin.jsx](file:///d:/R-WORK/MAVEX/client/src/pages/ViolationsAdmin/ViolationsAdmin.jsx) | Disciplinary and quality infraction logs |
| `/login` | Auth | [Login.jsx](file:///d:/R-WORK/MAVEX/client/src/pages/Auth/Login.jsx) | Firebase authentication screen |
| `*` | 404 Not Found | [NotFound.jsx](file:///d:/R-WORK/MAVEX/client/src/pages/NotFound/NotFound.jsx) | Graceful error landing |
