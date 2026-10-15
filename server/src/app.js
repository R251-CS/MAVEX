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

app.use(cors());
app.use(express.json());

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

// Health check endpoint
apiV1Router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      service: 'Mavex API Gateway',
      version: 'v1'
    }
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
