// backend/routes/invoices.routes.js
const express = require('express');
const router = express.Router();
const invoicesController = require('../controllers/Invoices/invoice_contoller');

// Middleware for authentication and authorization
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/adminMiddleware');

router.get('/', invoicesController.getInvoices);
router.get('/:id', invoicesController.getInvoiceById);
router.put('/:id/status', invoicesController.updateInvoiceStatus);
router.post('/generate-invoice', invoicesController.generateInvoice);
router.get('/:id/download-pdf', invoicesController.generatePDF);

module.exports = router;
