# MAVEX — Frontend Redesign Specification

**Document type:** Frontend requirements, design system, component architecture, and implementation brief  
**Project:** MAVEX Integrated Factory Management System  
**Frontend stack:** React + Vite (JavaScript/JSX, matching the proposed repository structure)  
**Language and layout:** Arabic-first, RTL, Cairo font  
**Status:** Planning specification — do not start implementation until the existing repository has been inspected

---

## 1. Copy-and-use implementation prompt

> Act as a senior frontend engineer and product UI/UX designer specializing in React dashboards for industrial operations and factory management systems.
>
> Rebuild the MAVEX frontend from the ground up while preserving the known product purpose and observed workflows. Use the existing project structure and installed dependencies where possible. The application is built with **React + Vite** and must remain compatible with a separate **Node.js + Express modular backend** and **Firebase/Cloud Firestore**. This is a frontend redesign task; do not redesign the backend, change the database schema, or invent API endpoints. Inspect the repository before making changes and document any assumptions.
>
> ### Visual direction
>
> Create a premium, modern, industrial enterprise interface using:
>
> - **Glassmorphism:** translucent panels, subtle blur, layered surfaces, fine borders, and restrained depth. Keep text and controls readable; avoid excessive blur that obscures information.
> - **Gradient colors:** use a coherent gradient system for selected navigation, primary actions, highlights, chart accents, and occasional background glows. Do not apply gradients to every card or every text element.
> - **Neon accents:** use restrained cyan, electric blue, and violet accents, with semantic green, amber, and red for status. Neon should communicate focus, selection, progress, or status, not make the application look like an arcade or gaming dashboard.
> - **Light and dark themes:** provide a working theme toggle. Both themes must be designed intentionally, not one theme produced by simply inverting the other. Persist the user's choice in `localStorage`, respect the operating-system preference on first visit, and prevent an obvious flash of the wrong theme during initial rendering.
> - **Industrial identity:** retain the MAVEX / MAVEX Metals identity where project assets are available. The final result should feel trustworthy, precise, and suitable for managers and factory staff.
>
> ### UX and layout
>
> - The product is Arabic-first. Set `dir="rtl"` correctly and use the Cairo font or the project's equivalent locally available font setup. Keep numbers, dates, chart labels, and mixed Arabic/English identifiers legible.
> - Build a responsive application shell with a consistent header, navigation/sidebar, page title, shared month selector, user/role area, and logout action when supported by the existing authentication flow.
> - Fix the current layout problems: do not leave large unused areas, do not squeeze the important content into a small region, and do not let charts dominate the page without adding decision-making value.
> - Use a clear visual hierarchy, consistent spacing, sensible content widths, strong typography, and aligned cards. Make data-dense tables usable on smaller screens.
> - Support keyboard navigation, visible focus states, semantic HTML, accessible labels, reduced-motion preferences, and sufficient contrast in both themes.
> - Use responsive breakpoints for desktop, tablet, and mobile. On small screens, collapse navigation appropriately and make tables horizontally scrollable or convert suitable rows into cards.
>
> ### Known screens and observed features
>
> Build the page structure for the following known routes/areas, matching existing route conventions if they already exist:
>
> 1. **Authentication:** login page and appropriate loading/error states; integrate with the project's existing Firebase Authentication setup if present. Do not hardcode credentials.
> 2. **Main dashboard:** department overview cards, overall performance summary, radar chart or a more legible equivalent, shared month filter, section/department navigation, and logout action.
> 3. **Technical Office:** department-responsible field; KPI indicators for execution speed (85%), fewer errors (90%), and work development (80%); engineering-team cards; add engineer, view details, and delete affordances where existing functionality supports them.
> 4. **Production:** section-responsible field; KPI indicators for efficiency (88%), waste reduction (14%), and schedule adherence (90%); worker/staff list; add worker, view details, and delete affordances where supported.
> 5. **Quality:** section-responsible field; KPI indicators for acceptance (95%), inspection (92%), and customer quality (98%); event/machine log with date, item/machine, problem/description, and status columns; add-entry action; empty state when there are no records.
> 6. **Planning & Warehouse.**
> 7. **Maintenance.**
> 8. **Safety & Occupational Health.**
> 9. **Senior Management & Violations.**
>
> The exact features and data model of screens 6–9 are not fully verified yet. Create a consistent page foundation for them, but do not invent operational features or imply that unfinished actions work. Use clearly documented placeholders until requirements have been inspected.
>
> The currently observed dashboard sample for October 2026 shows overall performance of 67%, with department cards: Production 64%, Senior Management & Violations 77%, Planning & Warehouse 48%, Maintenance 91%, Quality 95%, Technical Office 95% (responsible person displayed as Ahmed), and Safety 0%. These figures are **reference/sample data from screenshots only**, not validated production values. Keep them in an isolated mock-data fixture when needed; do not embed them throughout UI components or treat them as authoritative backend data.
>
> ### React architecture
>
> Keep a conventional, understandable React structure:
>
> - `pages/` for route-level screens.
> - `components/common/` for reusable buttons, inputs, dialogs, status badges, loaders, empty states, and tables.
> - `components/layout/` for the application shell, header, sidebar, and page container.
> - `components/dashboard/` for overview cards and charts.
> - `components/departments/` for department cards, KPI displays, employee/team cards, and event tables.
> - `context/` for authentication state and shared month/theme state only where genuinely global.
> - `hooks/` for reusable behavior.
> - `services/` for HTTP/API client functions and any approved Firebase client operations.
> - `utils/` for date/number formatting and other pure helpers.
> - `styles/` for theme tokens, global CSS, typography, and RTL rules.
> - `mocks/` for isolated development fixtures; keep mock data separate from production service code.
>
> Follow the backend's modular domains in naming and feature grouping, but do not duplicate backend business logic in the frontend. For example, frontend `Production` calls production API functions; the server remains responsible for production rules and calculations.
>
> ### Data and integration rules
>
> - Inspect existing code and configuration before choosing libraries or changing package files. Reuse installed tools where reasonable; do not add a large UI framework only for convenience.
> - Use the project's established styling approach. If none exists, choose a small and consistent setup (CSS variables with modular CSS or the project's existing utility CSS) and document the choice.
> - Keep API calls in services rather than inside visual components. Add a single configured API client with environment-based base URL, consistent error handling, and request timeouts where appropriate.
> - Do not call Express endpoints that have not been confirmed. If the API is not implemented yet, use typed-by-convention mock adapters or a clearly marked service interface without pretending that saving succeeded.
> - Do not place Firebase Admin credentials or server secrets in the frontend. Never expose secrets through `VITE_*` variables.
> - If the existing architecture uses Express as the trusted application API, route protected business operations through it. The UI may hide or disable actions based on permissions for usability, but backend authorization remains authoritative.
> - Treat KPI values as read-only until editing permissions and persistence behavior are confirmed. If a slider is truly editable in the existing app, expose accessible controlled input behavior only for permitted roles and only persist through a confirmed API method.
> - Use shared month state so the selected reporting month stays consistent between dashboard and department pages. Use `YYYY-MM` as the normalized month representation. Do not silently hardcode October 2026 as the real current month; it is sample screenshot data.
>
> ### Required UI states and interactions
>
> Every data-driven page should account for:
>
> - Initial loading/skeleton state.
> - Empty state with a clear explanation and the relevant action, if allowed.
> - Error state with a retry path and no misleading success message.
> - Success feedback after the server confirms a successful mutation.
> - Confirmation dialog for destructive actions.
> - Form validation and field-level error messages.
> - Disabled/loading state during a submitted action to prevent accidental duplicate requests.
> - Permission-denied state where appropriate.
> - Chart fallback when data is missing or insufficient.
>
> Do not use browser `alert()`/`confirm()` as the final interaction design. Use reusable accessible dialog/toast components if the project does not already have them.
>
> ### Visual design system
>
> Define centralized tokens for:
>
> - Page/background, surface, elevated surface, text, muted text, border, and focus colors for both themes.
> - Primary, secondary, and accent gradients.
> - Semantic success/warning/error/info colors.
> - Border radius, spacing scale, shadow, glass opacity, blur levels, and transition timing.
> - Typography scale and chart palette.
>
> Suggested starting palette (tune during implementation):
>
> - Base navy/charcoal for dark mode and warm near-white/cool gray for light mode.
> - Electric blue and cyan as primary accents.
> - Violet as a secondary gradient accent.
> - Green, amber, and red only for meaningful operational states.
>
> Keep neon glow low-opacity and localized. Do not use glow as the only indication of status. Ensure text and charts remain readable over glass surfaces.
>
> ### Quality requirements
>
> - No horizontal overflow at common desktop, tablet, and mobile widths.
> - Correct RTL alignment and behavior for navigation, tables, dialogs, forms, charts, and icons.
> - No duplicated theme logic or scattered hardcoded colors; consume design tokens.
> - Reusable components instead of repeated page-specific markup.
> - Stable React keys and correct controlled-input behavior.
> - No console errors, broken routes, dead buttons, or fake success feedback.
> - Document how to run the frontend and configure environment variables in the README or frontend documentation.
> - Add focused tests for navigation/theme behavior and important components if a test framework already exists; otherwise recommend a minimal setup rather than adding unnecessary dependencies.
>
> ### Deliverables
>
> 1. Rebuilt frontend with the agreed visual system and responsive RTL layout.
> 2. A detailed Markdown specification at `docs/FRONTEND_SPECIFICATION.md` describing the design system, layout, routes, component structure, state management, accessibility, data integration boundaries, and completion checklist.
> 3. A summary of files changed, dependencies added (with justification), routes implemented, mocked behavior, and remaining requirements.
>
> ### Work process
>
> 1. Inspect the existing repository and report its current frontend stack and reusable assets.
> 2. Draft/confirm the UI foundations and page inventory before large-scale implementation.
> 3. Implement the application shell and theme system first.
> 4. Rebuild the dashboard, then the known Technical Office, Production, and Quality screens.
> 5. Add consistent page foundations for unverified departments without inventing their business logic.
> 6. Verify routes, RTL layout, both themes, responsive behavior, and every visible interaction.
> 7. Create/update `docs/FRONTEND_SPECIFICATION.md` and summarize any blocked or assumed behavior.
>
> **Important:** This is a rebuild of the frontend, not permission to alter backend modules, database schema, authentication rules, business calculations, or production data. Do not begin backend/database changes as part of this task.

---

## 2. Product and UX goals

The frontend is the user-facing layer of an integrated factory management system. It must communicate operational status quickly and reliably, not merely look decorative.

### Primary goals

1. Replace the current cramped, mostly empty dashboard composition with a balanced layout that uses the available space well.
2. Establish one coherent interface across the dashboard and all seven operational departments.
3. Support light and dark appearance modes across the entire application.
4. Preserve Arabic RTL direction, legibility, and conventional workflows.
5. Keep all visual styling separate from business rules and data persistence.
6. Make the architecture straightforward for a small-to-medium codebase and a separate modular Express backend.

### Design principles

- **Operational clarity before decoration:** data values and actions remain the focal point.
- **Glass in layers:** glass panels distinguish hierarchy; not every element needs a glass treatment.
- **Neon as an accent:** small outlines, active indicators, chart series, and focus rings may glow subtly.
- **Gradients with purpose:** use primarily for primary actions, selected states, and a few prominent visual accents.
- **Consistent behavior:** the same table actions, dialog patterns, form styles, and status semantics work across pages.
- **Honest system feedback:** never tell a user an action succeeded unless the API confirms it.

---

## 3. Existing repository direction

The proposed root structure is:

```text
MAVEX/
├── firebase/
├── server/
├── client/
├── .gitignore
├── MAVEX_SYSTEM_ANALYSIS.md
└── MAVEX_SYSTEM_ANALYSIS_V2.md
```

The frontend remains under `client/` and uses React + Vite. Do not move it to Next.js or introduce a monorepo tool unless the existing repository already requires it or the owner approves the change.

Recommended frontend structure:

```text
client/
├── public/
├── src/
│   ├── assets/
│   │   ├── icons/
│   │   └── images/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── dashboard/
│   │   └── departments/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   │   ├── Auth/
│   │   ├── Dashboard/
│   │   ├── TechnicalOffice/
│   │   ├── Production/
│   │   ├── Quality/
│   │   ├── PlanningWarehouse/
│   │   ├── Maintenance/
│   │   ├── Safety/
│   │   └── ViolationsAdmin/
│   ├── services/
│   ├── mocks/
│   ├── styles/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── .env.example
└── package.json

docs/
└── FRONTEND_SPECIFICATION.md
```

This is a target structure, not a mandate to blindly move existing files. First inspect the repository, keep working code, and make incremental changes.

---

## 4. Route and page inventory

Use the current routes if they already exist. Otherwise, establish readable route names such as the following (exact URL paths may be adapted to the project):

| Page | Main purpose | Known UI responsibilities |
|---|---|---|
| Auth | Sign in | Form validation, loading/error feedback, redirect after confirmed authentication |
| Dashboard | Factory-wide overview | Month selector, seven department cards, overall performance, chart, navigation |
| Technical Office | Technical-office overview | Responsible person, three KPIs, engineering-team cards, details/add/delete affordances |
| Production | Production overview | Responsible person, three KPIs, staff cards, details/add/delete affordances |
| Quality | Quality monitoring | Responsible person, three KPIs, events/machines log, add-event affordance, empty state |
| Planning & Warehouse | Planning and stock operations | Page shell only until the actual workflows are confirmed |
| Maintenance | Equipment maintenance | Page shell only until the actual workflows are confirmed |
| Safety | Occupational safety | Page shell only until the actual workflows are confirmed |
| Senior Management & Violations | Management overview and violations | Page shell only until the actual workflows are confirmed |
| Not Found / Access Denied | Route and permission handling | Clear explanation and a safe navigation path |

### Shared application shell

- Header with MAVEX identity, page/role context, month selector when relevant, theme toggle, and user/logout actions where supported.
- Desktop navigation that clearly highlights the active route.
- Responsive navigation drawer or compact menu on narrow screens.
- Main content container with consistent maximum width and page gutters.
- Consistent page title and optional short description or breadcrumbs.
- Shared toast/notification area and dialog portal.

### Dashboard reference data

Observed screenshot sample, month `2026-10`:

| Department | Screenshot value | Additional observation |
|---|---:|---|
| Production | 64% | Dashboard card |
| Senior Management & Violations | 77% | Dashboard card |
| Planning & Warehouse | 48% | Dashboard card |
| Maintenance | 91% | Dashboard card |
| Quality | 95% | Dashboard card |
| Technical Office | 95% | Responsible person shown as Ahmed |
| Safety | 0% | Dashboard card |
| Overall | 67% | Large summary and radar chart |

These values are visual references only. Store them in a named fixture such as `src/mocks/dashboard.mock.js`. Do not spread them across components, treat them as production truth, or assume that the overall value is the arithmetic average; the real KPI formula remains unconfirmed.

### Known department screens

**Technical Office**

- Responsible person displayed as Ahmed in the captured screen.
- KPI labels and screenshot values: execution speed 85%, fewer errors 90%, work development 80%.
- Engineer card example: Mahmoud; errors 1; machines 2.
- Visible actions: Add Engineer, Details Log, Delete.

**Production**

- Responsible-person field is blank in the screenshot.
- KPI labels and screenshot values: efficiency (without errors) 88%; waste reduction 14%; schedule adherence 90%.
- Worker card example: “New Worker”; errors 1; machine value shown as unavailable/blank.
- Visible actions: Add Worker, Details Log, Delete.

**Quality**

- Responsible-person field is blank in the screenshot.
- KPI labels and screenshot values: acceptance 95%; inspection 92%; customer 98%.
- Event/machine log table columns: date, item/machine, problem/description, status.
- Empty state says no records are currently available; an Add action is visible.

The screenshots do not establish whether each KPI slider is editable by all users or which roles may mutate records. Reflect the visual affordance only after examining the existing behavior. Until confirmed, treat changes as unsaved presentation state and do not show fake persistence feedback.

---

## 5. Visual system

### 5.1 Suggested palette

Use tokens rather than hardcoding individual colors. Values below are starting points and should be checked for contrast in the implemented UI.

| Token | Dark-mode starting value | Light-mode starting value | Usage |
|---|---|---|---|
| `--color-bg` | `#080D18` | `#F3F6FB` | Page background |
| `--color-surface` | `rgba(20, 29, 46, .72)` | `rgba(255, 255, 255, .76)` | Primary glass surface |
| `--color-surface-solid` | `#141D2E` | `#FFFFFF` | Dialogs, dense tables, fallback surfaces |
| `--color-text` | `#F4F7FF` | `#172033` | Primary text |
| `--color-muted` | `#A6B2C8` | `#667085` | Supporting text |
| `--color-border` | `rgba(148, 163, 184, .22)` | `rgba(71, 85, 105, .18)` | Subtle separators |
| `--color-primary` | `#60A5FA` | `#2563EB` | Primary actions/links |
| `--color-cyan` | `#22D3EE` | `#0891B2` | Active accents and chart series |
| `--color-violet` | `#A78BFA` | `#7C3AED` | Secondary accents |
| `--color-success` | `#34D399` | `#047857` | Success/healthy state |
| `--color-warning` | `#FBBF24` | `#B45309` | Warning/attention |
| `--color-danger` | `#FB7185` | `#BE123C` | Errors/destructive actions |

Suggested gradients:

- Primary: electric blue → cyan.
- Secondary: blue → violet.
- Background glows: very low-opacity blue/cyan/violet radial gradients behind content, not directly beneath dense text.

Do not use these colors rigidly if existing brand assets establish a more appropriate MAVEX palette. Confirm visual consistency with the company logo where available.

### 5.2 Glassmorphism rules

- Use translucent surfaces with backdrop blur for selected panels, popovers, and the main shell where supported.
- Use subtle inner highlights and 1px borders; avoid thick glowing outlines on every card.
- Use a solid or nearly solid fallback where backdrop filtering is unsupported or where text/data density requires maximum readability.
- Do not place critical text over a decorative image or bright gradient.
- Tables and form controls can use less transparency than surrounding panels.

### 5.3 Neon rules

- Apply subtle outer glow to active navigation, focused form controls, selected chart points, or one primary action.
- Use status color plus label/icon; never rely on color or glow alone to communicate status.
- Respect `prefers-reduced-motion`; disable pulsing and intense transitions when requested.
- Avoid constant animation and excessive glow that could make the factory UI visually tiring.

### 5.4 Typography and RTL

- Use Cairo, loaded from a trustworthy local asset or the existing approved font setup.
- Define consistent typography sizes and weights for page headings, section headings, metric values, labels, table text, and helper text.
- Set `dir="rtl"` at the application boundary and use logical CSS properties (`margin-inline`, `padding-inline`, `inset-inline-start`) rather than left/right rules where possible.
- Mirror directional icons only when their semantic meaning is directional; do not mirror brand marks, charts, or all icons indiscriminately.
- Use locale-aware date and number formatting. The normalized reporting-month value should be stored as `YYYY-MM` independently of its displayed localized label.

### 5.5 Layout and spacing

- Define a consistent spacing scale, e.g. 4, 8, 12, 16, 24, 32, 40, and 48 px.
- Use a consistent page container and grid. At wide desktop widths, balance the overview cards and chart instead of leaving large empty regions or compressing the dashboard into one side.
- Establish consistent card heights only where doing so improves alignment; avoid fixed heights that clip localized labels.
- On mobile, stack high-level metrics, simplify charts, and allow dense tables to scroll horizontally.

---

## 6. Component inventory

Implement reusable components only where the shared behavior justifies them.

### Common

- `Button` — primary, secondary, ghost, and danger variants; loading/disabled states.
- `IconButton` — accessible label/tooltip for icon-only actions.
- `TextField` / `SelectField` / `MonthPicker` — labels, validation errors, focus state.
- `Card` / `GlassPanel` — standardized surface treatment.
- `StatusBadge` — text and semantic status styling.
- `KpiMetric` / `KpiSlider` — label, value, range display, and explicit read-only/edit state.
- `DataTable` — loading, empty, error, responsive, and action-column states.
- `Modal` / `ConfirmDialog` — keyboard focus handling and escape behavior where safe.
- `Toast` — success/error/info feedback only based on actual outcomes.
- `Skeleton` / `EmptyState` / `ErrorState`.
- `PageHeader` / `SectionHeader`.

### Layout

- `AppShell`, `AppHeader`, `Sidebar` or `MobileNav`, `PageContainer`, `ThemeToggle`, `UserMenu`, `GlobalMonthPicker`.

### Dashboard

- `OverallPerformanceCard`, `DepartmentPerformanceGrid`, `DepartmentCard`, `PerformanceChart`.
- If the existing chart library is unsuitable or unavailable, select a lightweight accessible library only after checking installed dependencies. Always offer readable text values alongside chart visuals.

### Department screens

- `DepartmentSummary` / `ResponsiblePersonField`.
- `KpiPanel`.
- `EmployeeCard` or `TeamMemberCard` with department-specific labels.
- `EventLogTable` for the verified quality log fields.
- `RecordFormDialog` when the actual record fields are known.

Avoid one giant component that contains every department's unique logic. Reuse presentation primitives while keeping each page's composition easy to understand.

---

## 7. Frontend state and service boundaries

### Suggested state ownership

- **Authentication context:** current authenticated user and authentication status, based on the existing authentication integration.
- **Theme context or hook:** `light` / `dark` choice; save preference locally. Avoid adding a state-management package for a small app unless existing complexity warrants it.
- **Month selection:** shared state at application level, optionally mirrored in query parameters when deep links should preserve the chosen month.
- **Page-local state:** open dialogs, form drafts, selected table row, local filter/sort state.
- **Server state:** loading/error/data should be owned by the API service/hook for the relevant query and invalidated/refetched after confirmed mutations.

### Service shape

Prefer feature-specific API modules, such as:

```text
services/
├── apiClient.js
├── authService.js
├── dashboardService.js
├── departmentService.js
├── technicalOfficeService.js
├── productionService.js
└── qualityService.js
```

The exact names and methods must match confirmed backend routes. Do not create fake endpoint contracts merely because a service filename exists.

A service function should:

1. Accept explicit parameters (such as `month`).
2. Make the request through a shared configured API client.
3. Normalize or safely surface API errors.
4. Return data, not manipulate visual components directly.
5. Never claim a mutation succeeded before the response confirms it.

Use `.env.example` to document non-secret client configuration (for example, API base URL and Firebase web configuration if required). Never include private Admin SDK credentials in the client bundle.

---

## 8. Forms, actions, and user feedback

- All form fields have persistent labels; placeholders are not a replacement for labels.
- Validate required fields and simple formats on the client for usability, while treating the backend as the authority.
- Destructive actions such as deleting a team member require a confirmation dialog that identifies the item where possible.
- Lock the submit action while a mutation is pending to reduce duplicate submissions.
- On success, show confirmation only after the server returns success and refresh/invalidate affected data.
- On failure, preserve user input when practical, display a useful message, and provide retry guidance when appropriate.
- Never silently swallow errors or leave the UI in a permanent loading state.
- If an operation is not yet wired to a backend route, show it as disabled or clearly non-production functionality; do not simulate a successful save.

---

## 9. Accessibility, responsiveness, and performance

### Accessibility

- Maintain readable contrast for text, form controls, and chart labels in both themes.
- All interactive controls must be keyboard accessible with visible focus indicators.
- Provide accessible names for icon-only buttons and status meanings in text.
- Ensure dialogs manage focus and return focus to the invoking control.
- Follow reduced-motion preferences and avoid unnecessary pulsing effects.

### Responsive acceptance widths

Verify at minimum around 360px, 768px, 1024px, and 1440px viewport widths. The app must have no unintended horizontal page overflow. Horizontal table scrolling is acceptable when appropriate and should be visually discoverable.

### Performance

- Avoid unnecessary global rerenders and overcomplicated context state.
- Lazy-load department routes if that materially reduces initial bundle size and existing setup supports it.
- Use memoization only where measurement or expensive computation justifies it.
- Avoid large animation libraries or chart libraries unless already installed or clearly needed.
- Keep visual effects modest so lower-powered office devices remain usable.

---

## 10. Security and permissions from the frontend perspective

- Never include passwords, service-account credentials, private keys, or backend secrets in source code or sample fixtures.
- Treat the frontend as untrusted. Hiding a button is a UX choice, not an authorization control.
- Display actions according to the user's confirmed permissions, but ensure the Express API independently validates every protected operation.
- Do not infer detailed role permissions from account names alone. Document unconfirmed role-to-page/action mappings as open questions.
- Avoid caching or logging salary or financial information in browser storage unless an explicit security review approves it.
- Do not print tokens or sensitive employee/financial values to the console.

---

## 11. Suggested implementation phases

### Phase 0 — Inspect and baseline

- Inspect `package.json`, current routes, components, CSS system, assets, installed libraries, and existing API/Firebase configuration.
- Record the baseline before moving files or replacing dependencies.
- Confirm which actions currently work and which are only visual.

### Phase 1 — Foundations

- Establish CSS design tokens for both themes.
- Implement RTL/font setup, app shell, navigation, shared header/month selector, and theme toggle.
- Create common primitives for cards, buttons, fields, dialogs, status badges, skeletons, and empty/error states.

### Phase 2 — Dashboard

- Implement balanced responsive layout, department grid, overall KPI summary, and chart.
- Use a single mock-data fixture until confirmed APIs exist.
- Verify chart readability and fallback behavior in both themes.

### Phase 3 — Verified department pages

- Rebuild Technical Office, Production, and Quality from the recorded screenshots.
- Keep sample values in fixture files only.
- Confirm details/add/delete dialog fields and actual permissions before wiring mutations.

### Phase 4 — Other department page foundations

- Implement consistent route shells for Planning & Warehouse, Maintenance, Safety, and Senior Management & Violations.
- Fill in operational workflows only after their pages and requirements have been inspected.

### Phase 5 — Integration

- Integrate confirmed API routes and authentication behavior.
- Implement loading/empty/error/success states.
- Verify shared month behavior and authorized action visibility.

### Phase 6 — Verification

- Test all routes, light/dark mode, RTL, responsive breakpoints, forms, dialogs, table behavior, chart fallback, and browser console.
- Test failures as well as successful paths.
- Produce a summary of completed pages, mock-only behaviors, dependencies, and unresolved requirements.

---

## 12. Acceptance checklist

### Visual

- [ ] Light and dark themes are both deliberate and readable.
- [ ] Glassmorphism is subtle and does not compromise contrast.
- [ ] Gradients and neon accents are coherent and restrained.
- [ ] Dashboard uses available space effectively; no large unexplained empty regions.
- [ ] Cards, tables, forms, and charts share consistent spacing and styles.
- [ ] The interface remains legible and usable at desktop, tablet, and mobile widths.

### Product behavior

- [ ] Every visible navigation item leads to the correct route.
- [ ] Theme preference persists and initializes without obvious theme flash.
- [ ] Month selection stays consistent where applicable.
- [ ] Screens reproduce the currently verified data fields and action affordances.
- [ ] No unverified business workflow is presented as complete.
- [ ] Empty, loading, error, and success states are implemented honestly.
- [ ] Destructive actions have confirmation and clear results.

### Engineering

- [ ] Visual components do not own backend business rules.
- [ ] API requests live in service functions, not scattered across page JSX.
- [ ] Mock data is isolated and clearly marked.
- [ ] No credentials/secrets are exposed in the client.
- [ ] No dead buttons, fake save-success messages, broken links, or console errors remain.
- [ ] Frontend documentation is updated at `docs/FRONTEND_SPECIFICATION.md`.

---

## 13. Open questions to resolve before production integration

1. Which role can access each department, view metrics, edit KPIs, add or delete staff, and view detailed records?
2. Are the KPI sliders editable controls or display-only values? If editable, what are the valid bounds and save behavior?
3. What fields must be included in engineer, worker, and quality-event detail forms?
4. What is the definitive API contract and base URL for each page?
5. What are the real KPI formulas and their reporting periods?
6. Should the selected month be reflected in the URL, persisted per user, or reset on login?
7. Which exact workflows belong to Planning & Warehouse, Maintenance, Safety, and Senior Management & Violations?
8. Are there official MAVEX brand colors, logos, icon sets, and approved fonts in the repository?
9. Which browsers and minimum mobile/desktop sizes must be supported?
10. Is any approved part of the frontend allowed to read Firestore directly, or must all business data pass through Express?

Until these questions are settled, implement the UI foundation and verified screens without guessing business behavior.
