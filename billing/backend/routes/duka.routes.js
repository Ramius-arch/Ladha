const express = require('express');
const router = express.Router();
const checkoutService = require('../services/commerce/checkoutService');
const ledger = require('../services/commerce/ledger');
const idempotency = require('../middleware/idempotency');
const db = require('../models');

const Order = db.Order;
const OrderLine = db.OrderLine;
const PaymentIntent = db.PaymentIntent;
const Customer = db.Customer;
const Invoice = db.Invoice;
const Payment = db.Payment;

/**
 * POST /api/stores/:storeId/checkout
 * Core storefront checkout gateway (invoked directly by duka-client.js)
 */
router.post('/stores/:storeId/checkout', idempotency('checkout'), async (req, res) => {
  try {
    const { storeId } = req.params;
    const { customer, items, payment = {} } = req.body;

    const result = await checkoutService.processCheckout({
      storeId: storeId || 'ladha-nairobi',
      customer,
      items,
      region: customer?.address || customer?.region,
      paymentMethod: payment?.method || 'mpesa'
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error('Storefront checkout error:', err);
    const status = err.status || 500;
    return res.status(status).json({
      success: false,
      error: err.message || 'Checkout failed',
      soldOutItemId: err.soldOutItemId
    });
  }
});

/**
 * POST /api/stores/:storeId/reservations/sweep
 * Triggers or inspects the reservation sweeper daemon
 */
router.post('/stores/:storeId/reservations/sweep', async (req, res) => {
  try {
    const sweeper = require('../services/commerce/reservationSweeper');
    const result = await sweeper.sweepExpiredReservations();
    return res.json({ success: true, ...result, telemetry: sweeper.getStatus() });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/mpesa/query/:checkoutRequestId
 * Polls payment intent status from database
 */
router.get('/mpesa/query/:checkoutRequestId', async (req, res) => {
  try {
    const { checkoutRequestId } = req.params;
    const intent = await PaymentIntent.findOne({
      where: { checkoutRequestId },
      include: [{ model: Order }]
    });

    if (!intent) {
      return res.status(404).json({ error: 'STK session not found.' });
    }

    const isPaid = intent.status === 'succeeded';
    const isFailed = intent.status === 'failed' || intent.status === 'cancelled' || intent.status === 'expired';

    return res.json({
      paymentStatus: isPaid ? 'PAID' : (isFailed ? 'FAILED' : 'PENDING'),
      mpesaReceipt: intent.receiptNumber || null,
      orderId: intent.Order ? intent.Order.orderNumber : null,
      status: intent.status
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/mpesa/simulate-action
 * Developer action to simulate customer PIN approval or cancellation
 */
router.post('/mpesa/simulate-action', async (req, res) => {
  try {
    const { checkoutRequestId, action } = req.body;

    if (action === 'APPROVE') {
      const result = await checkoutService.settlePayment(checkoutRequestId);
      return res.json(result);
    } else {
      const result = await checkoutService.cancelPayment(checkoutRequestId, 'Cancelled in simulator');
      return res.json(result);
    }
  } catch (err) {
    console.error('Simulate action error:', err);
    return res.status(err.status || 500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/mpesa/callback
 * Live Safaricom Daraja STK Push Callback (Idempotent)
 */
router.post('/mpesa/callback', async (req, res) => {
  try {
    const body = req.body?.Body?.stkCallback || req.body;
    const checkoutRequestId = body.CheckoutRequestID || req.body.checkoutRequestId;
    const resultCode = body.ResultCode;

    if (!checkoutRequestId) {
      return res.status(400).json({ ResultCode: 1, ResultDesc: 'Missing CheckoutRequestID' });
    }

    if (resultCode === 0) {
      let receiptCode = null;
      const metadataItems = body.CallbackMetadata?.Item || [];
      const receiptItem = metadataItems.find(i => i.Name === 'MpesaReceiptNumber');
      if (receiptItem) receiptCode = receiptItem.Value;

      await checkoutService.settlePayment(checkoutRequestId, { receiptCode });
    } else {
      const reason = body.ResultDesc || 'M-Pesa transaction failed or cancelled';
      await checkoutService.cancelPayment(checkoutRequestId, reason);
    }

    return res.json({ ResultCode: 0, ResultDesc: 'Callback processed successfully' });
  } catch (err) {
    console.error('M-Pesa callback processing error:', err);
    return res.status(500).json({ ResultCode: 1, ResultDesc: err.message });
  }
});

/**
 * GET /api/stores/:storeId/orders
 * Returns all customer orders with line items for a store
 */
router.get('/stores/:storeId/orders', async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { storeId: req.params.storeId || 'ladha-nairobi' },
      include: [
        { model: Customer, attributes: ['id', 'name', 'phone_number', 'email'] },
        { model: OrderLine, as: 'lines' },
        { model: Invoice, as: 'invoice' },
        { model: Payment }
      ],
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    return res.json({ success: true, total: orders.length, orders });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/orders
 * Global orders list for admin & reporting
 */
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: Customer, attributes: ['id', 'name', 'phone_number', 'email'] },
        { model: OrderLine, as: 'lines' },
        { model: Invoice, as: 'invoice' },
        { model: Payment }
      ],
      order: [['createdAt', 'DESC']],
      limit: 100
    });
    return res.json({ success: true, total: orders.length, orders });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/orders/:id
 * Single order details
 */
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: Customer },
        { model: OrderLine, as: 'lines' },
        { model: Invoice, as: 'invoice', include: [{ model: db.InvoiceLine, as: 'lines' }] },
        { model: Payment }
      ]
    });
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
    return res.json({ success: true, order });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/stores/:storeId/orders/:orderNumber/refund
 * Initiates an audited refund with balanced double-entry contra-journal entries
 */
router.post('/stores/:storeId/orders/:orderNumber/refund', idempotency('refund'), async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { reason, returnToStock = true, refundDelivery = false } = req.body;

    const result = await checkoutService.refundOrder({
      orderNumber,
      reason,
      returnToStock,
      refundDelivery
    });

    return res.json(result);
  } catch (err) {
    console.error('Order refund error:', err);
    return res.status(err.status || 500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/ledger/trial-balance
 * Returns real-time balanced double-entry trial balance
 */
router.get('/ledger/trial-balance', async (req, res) => {
  try {
    const balance = await ledger.getTrialBalance();
    return res.json({ success: true, ...balance });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/commerce/invoices/:orderNumber/etims-pdf
 * Streams an official KRA eTIMS Tax Invoice PDF for an order
 */
router.get('/commerce/invoices/:orderNumber/etims-pdf', async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { generateEtimsInvoicePdf } = require('../services/commerce/etimsInvoiceService');
    const pdfBuffer = await generateEtimsInvoicePdf(orderNumber);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="eTIMS_Tax_Invoice_${orderNumber}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    return res.send(pdfBuffer);
  } catch (err) {
    console.error('eTIMS PDF generation error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/commerce/reconcile
 * POST /api/commerce/reconcile
 * Triggers automated double-entry ledger & M-Pesa audit
 */
const handleReconcile = async (req, res) => {
  try {
    const reconciliationService = require('../services/commerce/reconciliationService');
    const report = await reconciliationService.reconcileAll();
    return res.json({ success: true, ...report });
  } catch (err) {
    console.error('Reconciliation error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

router.get('/commerce/reconcile', handleReconcile);
router.post('/commerce/reconcile', handleReconcile);

/**
 * GET /api/commerce/reconciliation-status
 */
router.get('/commerce/reconciliation-status', (req, res) => {
  const reconciliationService = require('../services/commerce/reconciliationService');
  return res.json({ success: true, ...reconciliationService.getStatus() });
});

/**
 * GET /api/commerce/diligence/metrics
 * Returns real-time GAAP financials, bank underwriting ratios, and VC metrics
 */
router.get('/commerce/diligence/metrics', async (req, res) => {
  try {
    const diligenceService = require('../services/commerce/diligenceService');
    const data = await diligenceService.getFinancialDiligenceMetrics();
    return res.json({ success: true, data });
  } catch (err) {
    console.error('Diligence metrics error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/commerce/diligence/dossier-pdf
 * Streams an official Goldman Sachs / YC-grade Loan & VC Due Diligence Dossier PDF
 */
router.get('/commerce/diligence/dossier-pdf', async (req, res) => {
  try {
    const diligenceService = require('../services/commerce/diligenceService');
    const pdfBuffer = await diligenceService.generateDueDiligencePdf();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="LADHA_Capital_Due_Diligence_Dossier.pdf"');
    res.setHeader('Content-Length', pdfBuffer.length);
    return res.send(pdfBuffer);
  } catch (err) {
    console.error('Due diligence PDF generation error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
