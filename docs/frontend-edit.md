# Mavex UI Redesign — Refined Liquid Glass Industrial Design System

## 1. Role and Objective

Act as a Senior UI/UX Designer and Senior Frontend Engineer specializing in enterprise SaaS applications, industrial management systems, and production-grade design systems.

Your task is to redesign the existing Mavex Factory Management System using a refined **Liquid Glass + Modern Industrial SaaS** visual direction.

This is an implementation task, not a design proposal. Inspect the existing codebase, understand its architecture, and apply the redesign directly to the current application.

The target is a premium, modern industrial management interface inspired by the visual principles of Apple’s Liquid Glass design language, adapted for the clarity, usability, and information density required by a real factory management system.

Do not copy Apple's interface literally. Create a coherent and distinctive visual identity for Mavex.

## 2. Mandatory Rules Before Implementation

Before modifying any code:

1. Inspect the repository structure, package.json files, application entry points, existing routes, shared layouts, components, styling system, and available assets.
2. Identify the actual frontend framework, UI library, CSS solution, charting library, icon system, and existing design tokens.
3. Inspect the existing dashboard and all relevant application pages to understand their functionality and visual structure.
4. Identify the existing authentication, authorization, permissions, role-based navigation, API integrations, data-fetching logic, and loading/error states.
5. Reuse and improve the current components whenever practical instead of creating duplicate implementations.
6. Follow the conventions and architecture already established in the project.

Do not assume the application uses a particular framework or component library until you inspect the code.

**Critical constraints:**
- Do not rebuild the application from scratch.
- Do not create a separate demo dashboard or an unrelated prototype.
- Do not replace real application data with hardcoded mock data.
- Do not remove existing features, permissions, routes, filters, navigation items, or interactions.
- Do not modify backend business logic or API contracts merely to support the redesign.
- Do not introduce a new UI library or a large dependency without a clear technical justification.
- Preserve Arabic content and right-to-left behavior throughout the application.

## 3. Target Visual Direction

The design should communicate:

- Premium enterprise software.
- A modern, well-maintained industrial facility.
- Clear operational visibility.
- Professional data visualization.
- Subtle depth and transparency.
- Simplicity without losing useful information.

The final interface should feel like a carefully designed enterprise product, not a generic admin template, gaming dashboard, cyberpunk interface, or decorative glassmorphism experiment.

### Core visual principles

- Use a clean, light, warm-neutral visual foundation.
- Use a real industrial factory image as a carefully controlled background.
- Use translucent surfaces selectively rather than applying glass effects to every component.
- Keep cards, data tables, charts, and labels highly readable.
- Establish a strong visual hierarchy between page titles, KPI values, section headings, labels, and secondary information.
- Use consistent spacing, alignment, corner radii, typography, and component behavior.
- Prefer restrained colors and subtle elevation over strong glows, excessive gradients, or saturated neon effects.

## 4. Background and Industrial Atmosphere

Use the factory background image provided for this project as the main visual backdrop.

Preferred asset location:

`public/images/mavex-industrial-bg.png`

If the asset does not exist in the repository, locate the supplied image and place it at that path using the project's existing asset conventions. Do not generate a replacement image if the supplied image is available.

### Background behavior

- Cover the main dashboard viewport with the factory image using appropriate `background-size: cover` behavior.
- Choose a background position that keeps the machinery and industrial architecture visually balanced.
- Add a subtle warm-white or cool-neutral overlay to reduce excessive contrast.
- Use an additional gradient overlay when required to protect text legibility.
- Avoid making the image too dark, too colorful, or excessively sharp behind the UI.
- Preserve a visible sense of depth without competing with the dashboard content.
- Use suitable responsive background positioning on smaller screens.
- Avoid unnecessary image downloads, repeated copies, or large performance penalties.

Suggested conceptual treatment:

A modern factory photograph + a soft neutral overlay + semi-opaque interface surfaces + subtle shadows.

Do not place a strong blur filter across the entire page. Control the atmosphere with overlays and apply backdrop blur only to suitable foreground surfaces.

If the background reduces readability, prioritize readability over visual effects.

## 5. Design Tokens and Color System

Create or refine a centralized design-token system using the project's existing styling conventions.

Use the following palette as a starting point, not as disconnected colors applied arbitrarily.

### Primary surfaces

- Page neutral: `#F3F5F2`
- Primary surface: `#FFFFFF`
- Soft secondary surface: `#E9EEEA`
- Primary text: `#17231F`
- Secondary text: `#63716B`
- Subtle border: `rgba(38, 57, 49, 0.12)`

### Brand identity

- Primary forest green: `#195B4D`
- Dark industrial green: `#123F36`
- Soft green surface: `#E1F2E9`
- Positive status: `#16865B`

### Semantic accents

- Information blue: `#2784E8`
- Warning amber: `#D99523`
- Error red: `#D74747`

### Glass surfaces

Use restrained translucent surfaces such as:

- Primary glass: `rgba(255, 255, 255, 0.76)`
- Secondary glass: `rgba(255, 255, 255, 0.62)`
- Subtle glass border: `rgba(255, 255, 255, 0.72)`
- Glass shadow: `0 8px 28px rgba(25, 42, 35, 0.08)`

Adapt opacity and contrast according to the underlying background.

### Color rules

- Green represents positive performance or successful operational states.
- Blue represents neutral information, navigation accents, or informational actions.
- Amber represents warnings and attention-required states.
- Red represents genuine errors, critical alerts, or dangerous conditions.
- Do not use multiple accent colors on the same component without a functional reason.
- Do not assign semantic colors based solely on decoration.
- Avoid neon gradients, excessive glow, and randomly colored icons.
- Maintain sufficient contrast for labels, numbers, controls, and charts.

All design tokens should be centralized and reusable. Avoid scattering inconsistent color values across individual components.

## 6. Liquid Glass Implementation

Implement a refined version of Liquid Glass rather than a heavy glassmorphism theme.

### Recommended places for glass effects

1. Top navigation and toolbar.
2. Sidebar or navigation surface.
3. Compact KPI cards, where appropriate.
4. Selected dropdowns, popovers, and floating controls.
5. Small utility panels and lightweight overlays.

### Glass styling requirements

- Use `backdrop-filter: blur(...)` selectively.
- Use semi-transparent backgrounds rather than completely transparent panels.
- Apply subtle borders to distinguish surfaces from the background.
- Use soft shadows to establish depth.
- Preserve readable text and recognizable controls.
- Keep icons crisp and avoid excessive luminous effects.
- Respect performance constraints when several translucent elements overlap.

Do not use strong blur on every chart, table, list item, or content panel.

For complex data sections, prefer nearly opaque light surfaces with subtle transparency so users can read information without distraction.

Provide suitable fallback backgrounds when `backdrop-filter` is unavailable.

Respect the user's reduced-motion preference and avoid unnecessary animated blur or continuously moving decorative effects.

## 7. Global Application Layout

Redesign the shared application shell while retaining the existing routing and interaction model.

### A. Right-side Sidebar

Maintain a proper Arabic RTL navigation structure with the sidebar on the right.

The sidebar should contain the existing Mavex identity, navigation links, active-page indicator, and current user or account controls.

Requirements:

- Clean, well-spaced navigation items.
- Consistent outline icons from the existing icon library.
- A subtle translucent or semi-opaque background.
- A dark forest-green primary active state or another restrained brand treatment consistent with the selected palette.
- Clear hover, focus, active, and disabled states.
- Consistent icon alignment and Arabic text alignment.
- Existing role-based menu visibility and permissions must remain unchanged.
- Preserve existing collapse/expand behavior, if available.

Avoid excessively wide navigation labels, oversized icons, unnecessary borders, and inconsistent active states.

### B. Top Toolbar

Preserve existing toolbar functionality such as:

- Date or month selector.
- Theme controls, if supported.
- Notifications.
- Search.
- Connection or system status.
- User actions.

Use compact controls, subtle borders, comfortable touch targets, and refined glass surfaces.

Do not add decorative controls that have no working action.

### C. Main Content Area

- Preserve the RTL layout and existing content structure.
- Use consistent horizontal and vertical spacing.
- Align section titles, actions, cards, and charts with a shared layout grid.
- Use clear responsive breakpoints.
- Avoid unnecessary empty space, but do not cram every component together.
- Ensure the page scrolls correctly without overlapping fixed navigation or toolbars.
- Keep sticky and fixed elements compatible with the existing layout.

## 8. Dashboard Redesign

Use the existing Mavex dashboard as the functional source of truth.

Do not invent dashboard metrics or replace actual API values.

### A. Page Header

Preserve the existing Arabic dashboard heading, explanatory text, reporting period, and actions.

The page heading should be visually dominant without overwhelming the content.

Use a restrained type scale and consistent alignment.

### B. KPI Cards

Restyle the existing KPI cards while preserving their original values, labels, data sources, and interactions.

Examples of the types of indicators already represented in the dashboard include:

- Overall efficiency.
- Active production orders.
- Inspection or quality performance.
- Machinery readiness.

Use the actual metrics available in the application.

Each KPI card should provide:

- A clear label.
- A prominent value.
- A meaningful unit or percentage.
- An optional trend indicator when supported by real data.
- A small, consistent icon.
- A subtle semantic accent.
- A restrained border and shadow.

Avoid turning every card into a different color.

Use one consistent card structure with variations only where the information requires them.

### C. Department Performance Ranking

Improve the existing department comparison section.

Requirements:

- Preserve the existing department names, ranking, values, and data source.
- Use clear horizontal progress indicators.
- Align percentages and department names consistently for RTL.
- Use consistent track heights and spacing.
- Use semantic colors only when supported by the application's meaning.
- Keep ranking indicators visually secondary to actual department names and performance values.
- Ensure bars have appropriate accessible labels and meaningful textual values.
- Preserve loading, empty, and error states.

Do not replace existing data visualization logic without a demonstrated need.

### D. Overall Factory Performance

Refine the existing circular performance chart.

- Preserve the current chart library and its behavior whenever practical.
- Maintain accurate values and proportions.
- Use a subtle track and a restrained green progress arc.
- Display the main percentage clearly.
- Keep secondary metrics aligned and easy to compare.
- Avoid intense glow effects, multiple competing gradients, or decorative animations that obscure the value.

If the underlying chart is interactive, preserve tooltips and keyboard accessibility.

### E. Remaining Dashboard Sections

Review the other existing dashboard components, tables, summaries, and department entry points.

Apply the same design system consistently.

Do not force every section into a card when a table, divider, list, or unboxed layout would communicate the information more clearly.

Preserve all existing links and navigation targets.

## 9. Typography and Arabic RTL

Arabic typography is a critical requirement.

- Inspect the existing font configuration before changing it.
- Reuse an appropriate Arabic font already present in the project when possible.
- If a new font is justified, prefer a legible Arabic UI family such as IBM Plex Sans Arabic or Cairo, provided its licensing, availability, loading performance, and compatibility are appropriate.
- Avoid adding external font dependencies unnecessarily.
- Establish a consistent type scale for page titles, section headings, KPI values, labels, descriptions, and metadata.
- Use appropriate Arabic line height and letter spacing.
- Avoid clipping Arabic text, breaking words incorrectly, or mixing incorrect text directions.
- Keep Latin dates, numbers, percentages, and technical identifiers readable within the RTL interface.

### RTL requirements

- Preserve the application's existing RTL configuration.
- Use logical CSS properties such as `margin-inline-start`, `padding-inline-end`, and `border-inline-start` instead of hardcoding left/right assumptions.
- Ensure icons, navigation, chart labels, and inline controls align correctly in RTL.
- Handle mixed Arabic and Latin content using appropriate directionality.
- Verify dropdown placement, tooltips, popovers, and dialog positioning.

Do not introduce global CSS changes that break existing pages.

## 10. Component Architecture and Reusability

Implement the new visual system through reusable components and shared design tokens.

Depending on the existing project architecture, suitable component categories may include:

- Application shell.
- Sidebar and navigation item.
- Top toolbar.
- Page header.
- KPI card.
- Section container.
- Performance progress bar.
- Chart panel.
- Status indicator.
- Dropdown and popover.
- Table and filter controls.
- Loading skeleton.
- Empty state.
- Error state.

These are suggested component boundaries, not a requirement to create a new component for every item.

Avoid unnecessary component fragmentation.

Keep business logic separate from presentation where the current architecture supports that separation.

Preserve existing component contracts and avoid introducing avoidable prop drilling or global state.

## 11. Responsive Design

The design must work on desktop, laptop, tablet, and mobile devices.

### Desktop

- Preserve the main dashboard's efficient use of available space.
- Keep the right-hand navigation properly aligned.
- Maintain a balanced ratio between KPI cards and data visualization sections.

### Tablet

- Reflow dashboard cards when there is insufficient width.
- Prevent navigation from obscuring charts and tables.
- Preserve usable controls and readable metrics.

### Mobile

- Use an appropriate collapsible navigation pattern compatible with the existing application.
- Stack or rearrange KPI cards logically.
- Let dense tables scroll horizontally where appropriate rather than compressing their content illegibly.
- Prevent background images and translucent surfaces from interfering with text.
- Ensure controls have touch-friendly target sizes.
- Avoid horizontal page overflow.
- Preserve RTL alignment and functionality.

Do not merely shrink the desktop layout to fit a phone.

## 12. Accessibility and Usability

Ensure the redesign remains accessible and usable.

- Maintain sufficient text and interface contrast.
- Provide visible keyboard focus indicators.
- Preserve semantic HTML and appropriate ARIA attributes.
- Support keyboard navigation for menus, dialogs, dropdowns, and charts where applicable.
- Do not rely on color alone to communicate operational status.
- Provide accessible names for icon-only buttons.
- Respect reduced-motion settings.
- Ensure important text remains readable against the background image.
- Preserve existing authentication and authorization behavior.
- Ensure loading, empty, error, success, and disabled states remain understandable.

Visual polish must not come at the expense of usability.

## 13. Performance Requirements

The interface must remain responsive and efficient.

- Avoid excessive use of `backdrop-filter` over large areas.
- Avoid unnecessary re-renders.
- Do not add large dependencies solely for decoration.
- Reuse existing charting and icon libraries where possible.
- Optimize background image delivery using the capabilities of the current framework.
- Avoid loading large assets repeatedly.
- Preserve existing lazy-loading strategies.
- Do not introduce hydration errors or server/client rendering mismatches.
- Avoid layout shifts during image loading.
- Respect the application's existing performance and build configuration.

If a visual effect is expensive, provide a lighter fallback for lower-powered devices.

## 14. Functional Integrity

This is a visual redesign, not a business logic rewrite.

Preserve:

- Authentication and session management.
- Role-based access control.
- Permissions and protected routes.
- Navigation and route destinations.
- API calls and response handling.
- Database-backed content as consumed by the current frontend.
- Form validation and submissions.
- Search, filtering, sorting, and pagination.
- Charts and their underlying data.
- Notifications and system-status behavior.
- Existing dashboard actions.
- Error handling and loading states.
- Localization and date handling.

Do not fabricate successful responses or make nonfunctional elements appear operational.

Do not weaken permission checks to make a redesigned screen easier to access.

If an existing issue prevents implementation, identify it clearly and avoid silently changing unrelated logic.

## 15. Implementation Workflow

Execute the work in the following order.

### Phase 1 — Audit

Inspect the repository and identify the existing dashboard structure, shared components, global styles, routes, assets, and dependencies.

Document the specific files that should change and identify implementation risks.

Proceed with the implementation; do not stop after producing an audit report.

### Phase 2 — Design Foundation

Introduce or refine shared color tokens, typography, spacing, borders, radii, shadows, glass surfaces, and interaction states.

Ensure these values are reusable and compatible with the existing styling approach.

### Phase 3 — Application Shell

Apply the updated visual system to the sidebar, top toolbar, background, content surface, and shared layout.

Verify RTL behavior and the sidebar's existing interactive states.

### Phase 4 — Dashboard Components

Restyle the page header, KPI cards, department ranking, performance chart, and remaining sections.

Use existing real data and preserve all existing behavior.

### Phase 5 — Responsive and Accessibility Pass

Test desktop, tablet, and mobile layouts.

Verify text contrast, keyboard focus, navigation behavior, scroll containment, chart readability, and background rendering.

### Phase 6 — Validation

Run the project's available checks, including relevant linting, type checking, tests, and production build.

Fix issues introduced by the redesign.

Do not claim a check has passed unless it actually ran successfully.

## 16. Acceptance Criteria

The implementation is complete only when:

1. The existing application has been redesigned directly, with no separate demo application.
2. The industrial factory background is integrated tastefully and does not undermine readability.
3. The Liquid Glass treatment is refined, restrained, and consistent.
4. The sidebar, toolbar, cards, charts, and surrounding layout share a coherent visual language.
5. The interface retains Arabic RTL behavior.
6. Existing data, routes, interactions, permissions, and application logic are preserved.
7. The layout works across desktop, tablet, and mobile.
8. No major horizontal overflow, text clipping, broken navigation, or overlapping controls remain.
9. Accessibility and performance have been considered.
10. Relevant build and validation checks have been executed, and any remaining failures are documented.

## 17. Final Deliverables

After completing the implementation, provide:

- A concise summary of the visual improvements.
- The key files changed and why they changed.
- The new or modified design tokens and reusable components.
- Confirmation of which existing features and behaviors were preserved.
- The actual results of linting, type checking, tests, and the production build, including any failures.
- Any remaining issues or necessary follow-up work.

Start by inspecting the existing repository, then implement the redesign incrementally in the current codebase.

**Final design principle:** The factory environment should provide atmosphere, Liquid Glass should provide subtle depth, and the operational data should remain the primary focus of the interface.