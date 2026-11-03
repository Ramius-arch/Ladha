// backend/routes/payments.routes.js
const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/Payments/payment_controller');

// Middleware for authentication
const auth = require('../middleware/auth');

router.get('/', paymentsController.getAllPayments);
router.get('/:id', paymentsController.getPaymentById);
router.post('/', paymentsController.createPayment);
router.put('/:id/status', paymentsController.updatePaymentStatus);
router.delete('/:id', paymentsController.deletePayment);

// Route for processing M-Pesa payments
router.post('/mpesa/callback', paymentsController.mpesaCallback);

module.exports = router;
