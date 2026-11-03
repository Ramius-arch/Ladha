/**
 * Unified Commerce Checkout & Order Management Engine
 * Connects Headless Storefronts, 1-of-1 Inventory, M-Pesa STK, and Double-Entry Ledger
 */

const db = require('../../models');
const ladhaService = require('../ladhaService');
const pricing = require('./pricing');
const ledger = require('./ledger');
const { clearCache } = require('../../middleware/cacheHandler');

const Customer = db.Customer;
const Order = db.Order;
const OrderLine = db.OrderLine;
const StockReservation = db.StockReservation;
const PaymentIntent = db.PaymentIntent;
const Invoice = db.Invoice;
const InvoiceLine = db.InvoiceLine;
const Payment = db.Payment;
const Bill = db.Bill;

class CheckoutService {
  /**
   * Main checkout handler for storefront transactions
   */
  async processCheckout({ storeId = 'ladha-nairobi', customer, items, region, paymentMethod = 'mpesa' }) {
    if (!customer || (!customer.phone && !customer.phone_number)) {
      const err = new Error('Customer phone number is required for checkout.');
      err.status = 400;
      throw err;
    }

    if (!items || !items.length) {
      const err = new Error('Checkout cart is empty.');
      err.status = 400;
      throw err;
    }

    const rawPhone = customer.phone || customer.phone_number;
    const normalizedPhone = ladhaService.normalizePhone(rawPhone);
    const orderNumber = `LDH-${Math.floor(1000 + Math.random() * 9000)}-KE`;
    const reservedProductIds = [];

    try {
      // Step 1: Real-time 1-of-1 Archival Inventory Check & Lock
      for (const item of items) {
        const itemId = item.id || item.productId;
        const product = await ladhaService.getProduct(itemId).catch(() => null);

        if (product && product.inStock === false) {
          // Already claimed by another buyer! Roll back prior items in this basket
          for (const resId of reservedProductIds) {
            await ladhaService.releaseItem(resId, orderNumber).catch(() => {});
          }
          const err = new Error(`Item "${item.title || item.name || itemId}" has already been claimed and is out of stock.`);
          err.status = 409; // HTTP 409 Conflict
          err.soldOutItemId = itemId;
          throw err;
        }

        // Atomically lock item in storefront catalog
        await ladhaService.reserveItem(itemId, orderNumber).catch((e) => {
          console.warn(`Could not set live inventory lock for ${itemId}:`, e.message);
        });
        reservedProductIds.push(itemId);
      }

      // Step 2: Customer Upsert (no forced subscription plan required!)
      let [dbCustomer] = await Customer.findOrCreate({
        where: { phone_number: normalizedPhone },
        defaults: {
          name: customer.name || 'Ladha Customer',
          phone_number: normalizedPhone,
          email: customer.email || `${normalizedPhone}@storefront.ladha.ke`,
          address: customer.address || region || 'Nairobi, Kenya',
          status: 'active'
        }
      });

      // Step 3: Compute VAT-inclusive Totals & Shipping Tariffs
      const totals = pricing.computeOrderTotals(items, region || customer.address || '');

      // Step 4: Persist Master Order
      const newOrder = await Order.create({
        orderNumber,
        storeId,
        customerId: dbCustomer.id,
        status: 'pending_payment',
        currency: 'KES',
        subtotal: totals.subtotal,
        shippingTotal: totals.shippingFee,
        taxTotal: totals.totalTax,
        total: totals.total,
        shippingZone: region || customer.address || 'Nairobi Standard',
        shippingAddress: customer.address || region || 'Nairobi, Kenya',
        customerName: dbCustomer.name,
        customerPhone: normalizedPhone,
        customerEmail: dbCustomer.email,
        paymentMethod
      });

      // Step 5: Persist Order Line Item Snapshots
      for (const item of items) {
        const itemQty = Number(item.quantity) || 1;
        const itemPrice = Number(item.price) || 0;
        await OrderLine.create({
          orderId: newOrder.id,
          productId: String(item.id || item.productId),
          sku: item.sku || `SKU-${item.id}`,
          title: item.title || item.name || 'Archival Garment',
          unitPrice: itemPrice,
          quantity: itemQty,
          taxRate: pricing.VAT_RATE,
          lineTotal: itemPrice * itemQty,
          image: item.image || ''
        });

        // Persist Stock Reservation record with 15-minute expiry
        await StockReservation.create({
          orderId: newOrder.id,
          productId: String(item.id || item.productId),
          reservationId: `${orderNumber}_${item.id}`,
          status: 'active',
          expiresAt: new Date(Date.now() + 15 * 60 * 1000)
        });
      }

      // Step 6: Create Bill (legacy compatibility) and Formal Tax Invoice
      const newBill = await Bill.create({
        customerId: dbCustomer.id,
        totalAmount: totals.total,
        paymentStatus: 'pending'
      }).catch(() => null);

      const newInvoice = await Invoice.create({
        orderId: newOrder.id,
        billId: newBill ? newBill.id : null,
        customerId: dbCustomer.id,
        invoiceNumber: `INV-${orderNumber}`,
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        amountDue: totals.total,
        status: 'pending'
      });

      // Create Invoice line items
      for (const item of items) {
        await InvoiceLine.create({
          invoiceId: newInvoice.id,
          description: item.title || item.name || 'Archival Garment',
          quantity: Number(item.quantity) || 1,
          unitPrice: Number(item.price) || 0,
          amount: (Number(item.price) || 0) * (Number(item.quantity) || 1),
          taxRate: pricing.VAT_RATE
        });
      }

      if (totals.shippingFee > 0) {
        await InvoiceLine.create({
          invoiceId: newInvoice.id,
          description: `Courier Delivery Tariff (${newOrder.shippingZone})`,
          quantity: 1,
          unitPrice: totals.shippingFee,
          amount: totals.shippingFee,
          taxRate: pricing.VAT_RATE
        });
      }

      // Step 7: Create Payment Intent
      const checkoutRequestId = `ws_CO_${Date.now()}_${Math.floor(Math.random() * 9000)}`;
      await PaymentIntent.create({
        orderId: newOrder.id,
        customerId: dbCustomer.id,
        checkoutRequestId,
        provider: 'mpesa',
        amount: totals.total,
        currency: 'KES',
        phoneNumber: normalizedPhone,
        status: 'requires_action'
      });

      clearCache('/api/reports*');

      return {
        success: true,
        order: {
          id: orderNumber,
          orderId: newOrder.id,
          billId: newBill ? newBill.id : null,
          invoiceId: newInvoice.id,
          subtotal: totals.subtotal,
          deliveryFee: totals.shippingFee,
          total: totals.total,
          taxTotal: totals.totalTax,
          netTotal: totals.totalNet,
          status: newOrder.status,
          reservedCount: reservedProductIds.length
        },
        mpesa: {
          mode: 'simulator',
          checkoutRequestId,
          promptPhone: normalizedPhone,
          amount: totals.total
        }
      };

    } catch (error) {
      // Rollback reservations on failure
      for (const resId of reservedProductIds) {
        await ladhaService.releaseItem(resId, orderNumber).catch(() => {});
      }
      throw error;
    }
  }

  /**
   * Settles payment for an active checkout session
   */
  async settlePayment(checkoutRequestId, options = {}) {
    const paymentIntent = await PaymentIntent.findOne({
      where: { checkoutRequestId },
      include: [{ model: Order, include: [{ model: OrderLine, as: 'lines' }] }]
    });

    if (!paymentIntent) {
      const err = new Error('Payment intent / STK session not found.');
      err.status = 404;
      throw err;
    }

    if (paymentIntent.status === 'succeeded') {
      return {
        success: true,
        status: 'PAID',
        receipt: paymentIntent.receiptNumber,
        orderRef: paymentIntent.Order ? paymentIntent.Order.orderNumber : null
      };
    }

    const receiptCode = options.receiptCode || `QK${Math.floor(100000 + Math.random() * 900000)}X`;
    const order = paymentIntent.Order;

    // 1. Mark PaymentIntent as succeeded
    paymentIntent.status = 'succeeded';
    paymentIntent.receiptNumber = receiptCode;
    await paymentIntent.save();

    // 2. Mark Order as paid
    if (order) {
      order.status = 'paid';
      order.mpesaReceipt = receiptCode;
      await order.save();
    }

    // 3. Mark Invoice and Bill as paid
    if (order) {
      await Invoice.update({ status: 'paid' }, { where: { orderId: order.id } });
    }

    // 4. Commit Stock Reservations (permanently sold)
    if (order) {
      await StockReservation.update({ status: 'committed' }, { where: { orderId: order.id } });
    }

    // 5. Create Payment Record
    const paymentRecord = await Payment.create({
      amount: paymentIntent.amount,
      payment_date: new Date(),
      payment_method: 'mpesa',
      receipt_number: receiptCode,
      status: 'completed',
      customerId: paymentIntent.customerId,
      orderId: order ? order.id : null
    });

    // 6. Post Immutable Balanced Double-Entry Journal Entry
    if (order) {
      const netSales = Math.round((order.subtotal / (1 + pricing.VAT_RATE)) * 100) / 100;
      const netDelivery = Math.round((order.shippingTotal / (1 + pricing.VAT_RATE)) * 100) / 100;
      const vatSales = Math.round((order.subtotal - netSales) * 100) / 100;
      const vatDelivery = Math.round((order.shippingTotal - netDelivery) * 100) / 100;
      const totalVat = Math.round((vatSales + vatDelivery) * 100) / 100;

      await ledger.postJournalEntry({
        reference: `JE-ORD-${order.orderNumber}`,
        description: `Settlement for Order ${order.orderNumber} via M-Pesa (${receiptCode})`,
        sourceType: 'order',
        sourceId: order.orderNumber,
        lines: [
          // Debit: M-Pesa Clearing (Total cash inflow)
          { accountCode: '1100', debit: order.total, credit: 0, description: 'Incoming M-Pesa settlement' },
          // Credit: Sales Revenue (Net goods)
          { accountCode: '4000', debit: 0, credit: netSales, description: 'Archival streetwear retail sales' },
          // Credit: Delivery Income (Net shipping)
          { accountCode: '4100', debit: 0, credit: netDelivery, description: 'Zonal shipping fee income' },
          // Credit: VAT Output Tax (KRA Output VAT 16%)
          { accountCode: '2200', debit: 0, credit: totalVat, description: 'Output VAT liability (16%)' }
        ]
      }).catch(err => console.error('Ledger posting warning:', err.message));
    }

    // 7. Synchronize into Storefront JSON Order Repository
    if (order) {
      await ladhaService.recordOrder({
        id: order.orderNumber,
        customerName: order.customerName,
        phone: order.customerPhone,
        address: order.shippingAddress,
        items: (order.lines || []).map(l => ({
          id: l.productId,
          title: l.title,
          price: l.unitPrice,
          quantity: l.quantity
        })),
        total: order.total,
        paymentMethod: 'MPESA',
        mpesaReceipt: receiptCode,
        status: 'VERIFIED',
        createdAt: new Date().toISOString()
      }).catch(err => console.error('Error syncing order to Ladha repository:', err.message));
    }

    clearCache('/api/reports*');

    return {
      success: true,
      status: 'PAID',
      receipt: receiptCode,
      orderRef: order ? order.orderNumber : null,
      payment: paymentRecord
    };
  }

  /**
   * Cancels payment and rolls back reserved stock
   */
  async cancelPayment(checkoutRequestId, reason = 'Customer cancelled payment') {
    const paymentIntent = await PaymentIntent.findOne({
      where: { checkoutRequestId },
      include: [{ model: Order, include: [{ model: StockReservation, as: 'reservations' }] }]
    });

    if (!paymentIntent) {
      const err = new Error('Payment intent / STK session not found.');
      err.status = 404;
      throw err;
    }

    paymentIntent.status = 'cancelled';
    paymentIntent.failureReason = reason;
    await paymentIntent.save();

    const order = paymentIntent.Order;
    if (order) {
      order.status = 'cancelled';
      await order.save();

      // Release reserved 1-of-1 pieces back to live inventory
      const reservations = order.reservations || [];
      for (const res of reservations) {
        await ladhaService.releaseItem(res.productId, order.orderNumber).catch(() => {});
        res.status = 'released';
        await res.save();
      }
    }

    return {
      success: true,
      status: 'CANCELLED',
      message: 'Payment cancelled. Reserved items returned to live storefront inventory.'
    };
  }

  /**
   * Processes a formal order refund and books double-entry contra-reversal in the ledger
   */
  async refundOrder({ orderNumber, reason = 'Customer requested return', returnToStock = true, refundDelivery = false }) {
    const order = await Order.findOne({
      where: { orderNumber },
      include: [
        { model: OrderLine, as: 'lines' },
        { model: StockReservation, as: 'reservations' },
        { model: Invoice, as: 'invoice' }
      ]
    });

    if (!order) {
      const err = new Error(`Order ${orderNumber} not found.`);
      err.status = 404;
      throw err;
    }

    if (order.status !== 'paid') {
      const err = new Error(`Order ${orderNumber} cannot be refunded because its status is "${order.status}". Only paid orders can be refunded.`);
      err.status = 400;
      throw err;
    }

    // 1. Release items back to storefront inventory if requested
    const releasedItems = [];
    if (returnToStock) {
      for (const line of (order.lines || [])) {
        await ladhaService.releaseItem(line.productId, `REFUND_${orderNumber}`).catch(e => {
          console.warn(`Could not release item ${line.productId} on storefront:`, e.message);
        });
        releasedItems.push(line.productId);
      }
      if (order.reservations) {
        for (const res of order.reservations) {
          res.status = 'released';
          await res.save();
        }
      }
    }

    // 2. Post balanced contra-reversal in double-entry general ledger
    const reversal = await ledger.postReversalEntry({
      orderNumber,
      reason,
      refundAmount: refundDelivery ? order.total : (order.subtotal || order.total),
      refundDelivery
    });

    // 3. Update Order and Invoice status
    order.status = 'refunded';
    await order.save();

    if (order.invoice) {
      order.invoice.status = 'refunded';
      await order.invoice.save();
    }

    clearCache('/api/reports*');

    return {
      success: true,
      orderNumber,
      status: 'REFUNDED',
      reversalEntry: reversal.reversalEntry.entryNumber,
      totalRefunded: reversal.totalRefunded,
      itemsReturnedToStock: releasedItems
    };
  }
}

module.exports = new CheckoutService();
