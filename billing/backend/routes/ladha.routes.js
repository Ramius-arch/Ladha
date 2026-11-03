/**
 * Ladha Commerce & Inventory Bridge Routes for Qx_Billing
 * Connects Qx_Billing to Ladha Storefront via unified checkoutService
 */

const express = require('express');
const router = express.Router();
const ladhaService = require('../services/ladhaService');
const checkoutService = require('../services/commerce/checkoutService');
const db = require('../models');

const Order = db.Order;
const OrderLine = db.OrderLine;
const Customer = db.Customer;
const Invoice = db.Invoice;
const Payment = db.Payment;

/**
 * GET /api/ladha/health
 * Ping Ladha storefront API from Qx_Billing
 */
router.get('/health', async (req, res) => {
  try {
    const health = await ladhaService.checkHealth();
    return res.json({
      status: 'ok',
      qxBilling: 'connected',
      ladhaStorefront: health
    });
  } catch (e) {
    return res.status(502).json({
      status: 'error',
      error: 'Failed to communicate with Ladha API',
      details: e.message
    });
  }
});

/**
 * GET /api/ladha/products
 * Qx_Billing queries the live Ladha garment catalog via HTTP API
 */
router.get('/products', async (req, res) => {
  try {
    const products = await ladhaService.getProducts();
    return res.json({
      success: true,
      source: 'ladha-api',
      total: products.length,
      products
    });
  } catch (e) {
    return res.status(502).json({ success: false, error: e.message });
  }
});

/**
 * POST /api/ladha/checkout
 * Transactional Checkout with 1-of-1 Archival Reservation
 */
router.post('/checkout', async (req, res) => {
  try {
    const { customer, items, region, paymentMethod = 'mpesa' } = req.body;
    const result = await checkoutService.processCheckout({
      storeId: 'ladha-nairobi',
      customer,
      items,
      region,
      paymentMethod
    });
    return res.status(200).json(result);
  } catch (e) {
    const status = e.status || 500;
    return res.status(status).json({
      success: false,
      error: e.message || 'Checkout failed',
      soldOutItemId: e.soldOutItemId
    });
  }
});

/**
 * POST /api/ladha/simulate-payment
 * Resolves STK session via checkoutService
 */
router.post('/simulate-payment', async (req, res) => {
  try {
    const { checkoutRequestId, action } = req.body;
    if (action === 'APPROVE') {
      const result = await checkoutService.settlePayment(checkoutRequestId);
      return res.json(result);
    } else {
      const result = await checkoutService.cancelPayment(checkoutRequestId, 'Cancelled by simulator');
      return res.json(result);
    }
  } catch (e) {
    return res.status(e.status || 500).json({ success: false, error: e.message });
  }
});

/**
 * GET /api/ladha/orders
 * Returns combined order book from both Qx_Billing master orders and Ladha API
 */
router.get('/orders', async (req, res) => {
  try {
    const ladhaOrders = await ladhaService.getOrders().catch(() => []);
    const qxOrders = await Order.findAll({
      include: [
        { model: Customer, attributes: ['id', 'name', 'phone_number', 'email'] },
        { model: OrderLine, as: 'lines' },
        { model: Invoice, as: 'invoice' },
        { model: Payment }
      ],
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    return res.json({
      success: true,
      ladhaStoreOrders: ladhaOrders,
      qxBillingLedger: qxOrders
    });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
});

module.exports = router;
