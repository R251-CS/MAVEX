const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/error-handler');
const notFound = require('./middleware/not-found');

// Modules routes
const authRoutes = require('./modules/auth/auth.routes');
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');
const employeesRoutes = require('./modules/employees/employees.routes');
const qualityRoutes = require('./modules/quality/quality.routes');
const inventoryRoutes = require('./modules/inventory/inventory.routes');
const productionRoutes = require('./modules/production/production.routes');
const maintenanceRoutes = require('./modules/maintenance/maintenance.routes');
const safetyRoutes = require('./modules/safety/safety.routes');
const violationsRoutes = require('./modules/violations/violations.routes');
const financeRoutes = require('./modules/finance/finance.routes');

const app = express();

// CORS مع إعدادات مناسبة
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [process.env.CLIENT_URL || 'https://mavex.app']
    : true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-dev-user'],
  credentials: true
}));

// تحسين الأداء - headers الأمان والضغط
app.use((req, res, next) => {
  // Cache static API responses
  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

// JSON parsing مع حد أقصى للحجم
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


// Root landing route for browser or direct access
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Mavex API Gateway is up and running 🚀',
    documentation: '/api/v1/health',
    version: 'v1'
  });
});

// API version 1 root
const apiV1Router = express.Router();

// Health check endpoint with MongoDB status
apiV1Router.get('/health', async (req, res) => {
  const { testConnection } = require('./config/mongodb');

  const healthData = {
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    service: 'Mavex API Gateway',
    version: 'v1',
    environment: process.env.NODE_ENV || 'production',
    database: { status: 'unknown', provider: 'MongoDB' }
  };

  const conn = await testConnection(3000);
  if (conn.ok) {
    healthData.database = {
      status: 'connected',
      provider: 'MongoDB Database Server',
      databaseName: conn.name,
      host: conn.host,
      latency: `${conn.latency}ms`
    };
  } else {
    healthData.database = {
      status: 'disconnected',
      provider: 'MongoDB Database Server',
      error: conn.error || 'Database connection offline'
    };
    return res.status(503).json({
      status: 'error',
      message: 'MongoDB database is not connected',
      data: healthData
    });
  }

  res.status(200).json({
    status: 'success',
    data: healthData
  });
});


// Register all modular monolith endpoints
apiV1Router.use('/auth', authRoutes);
apiV1Router.use('/dashboard', dashboardRoutes);
apiV1Router.use('/employees', employeesRoutes);
apiV1Router.use('/quality', qualityRoutes);
apiV1Router.use('/inventory', inventoryRoutes);
apiV1Router.use('/production', productionRoutes);
apiV1Router.use('/maintenance', maintenanceRoutes);
apiV1Router.use('/safety', safetyRoutes);
apiV1Router.use('/violations', violationsRoutes);
apiV1Router.use('/finance', financeRoutes);

// Mount /api/v1
app.use('/api/v1', apiV1Router);

// 404 & Centralized Error Handler
app.use(notFound);
app.use(errorHandler);

module.exports = app;
