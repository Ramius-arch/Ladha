// routes.config.js

const express = require('express');
const router = express.Router();// added express router instance

// Import all route files
const customersRoutes = require('../routes/customers.routes');
const usageRoutes = require('../routes/usage.routes');
const billingRoutes = require('../routes/billing.routes');
const invoicesRoutes = require('../routes/invoices.routes');
const paymentsRoutes = require('../routes/payments.routes');
const reportsRoutes = require('../routes/reports.routes');

// added use routes with appropriate base paths
router.use('/api/customers', customersRoutes);
router.use('/api/usage', usageRoutes);
router.use('/api/billing', billingRoutes);
router.use('/api/invoices', invoicesRoutes);
router.use('/api/payments', paymentsRoutes);
router.use('/api/reports', reportsRoutes);

module.exports = {
  '/api/customers': customersRoutes,
  '/api/usage': usageRoutes,
  '/api/billing': billingRoutes,
  '/api/invoices': invoicesRoutes,
  '/api/payments': paymentsRoutes,
  '/api/reports': reportsRoutes,
};
