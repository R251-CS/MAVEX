# Mavex — نظام إدارة ومتابعة أداء أقسام المصنع

نظام متكامل لإدارة أقسام المصنع، وتتبع مؤشرات الأداء (KPIs)، والعمليات التشغيلية (الإنتاج، الجودة، المكتب الفني، المخازن، الصيانة، السلامة، والمخالفات).

## البنية التقنية
- **الخادم (Backend):** Node.js + Express (Modular Monolith)
- **الواجهة (Frontend):** React + Vite (RTL، خط Cairo، Dark Design)
- **قاعدة البيانات والمصادقة:** Firebase Authentication & Cloud Firestore (Admin SDK)

## مسار البيانات (Architecture Pattern)
`React Client` ➔ `Firebase Auth (ID Token)` ➔ `Express API (/api/v1)` ➔ `Middleware (Auth & Roles)` ➔ `Modules (Service/Repository)` ➔ `Cloud Firestore`

## متطلبات التشغيل المحلي
1. **الخادم (Backend):**
   ```bash
   cd server
   npm install
   npm run dev
   ```
2. **الواجهة (Frontend):**
   ```bash
   cd client
   npm install
   npm run dev
   ```
3. **وثائق التحليل وخطة التطوير:**
   توجد داخل مجلد `docs/`:
   - [MAVEX_DEVELOPMENT_ROADMAP.md](docs/MAVEX_DEVELOPMENT_ROADMAP.md)
   - [MAVEX_SYSTEM_ANALYSIS_V2.md](docs/MAVEX_SYSTEM_ANALYSIS_V2.md)
