const express = require('express');
const router = express.Router();
const reportController = require('../controllers/Reports/report_controller');

router.get('/customers', reportController.getAllCustomers);
router.get('/billing-trends', reportController.getBillingTrends);
router.get('/outstanding-dues', reportController.getOutstandingDues);
router.post('/financial-summary', reportController.generateFinancialSummary);
router.get('/usage-reports', reportController.getUsageReports);
router.get('/detailed-financial', reportController.generateDetailedFinancialReport);
router.get('/customer-usage-trend', reportController.getCustomerUsageTrend);
router.get('/top-customers', reportController.getTopCustomers);
router.post('/import', reportController.importMetrics);

module.exports = router;

