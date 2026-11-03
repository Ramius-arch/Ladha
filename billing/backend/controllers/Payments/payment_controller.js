const { ErrorHandler } = require('../../utlis/errorHandler');
const db = require('../../models'); // Import models from the centralized index.js
const { clearCache } = require('../../middleware/cacheHandler');
const Payment = db.Payment;
const Bill = db.Bill;
const Customer = db.Customer;
const Invoice = db.Invoice; // Assuming payments can affect invoices

async function getAllPayments(req, res) {
  try {
    const payments = await Payment.findAll({
      include: [
        { model: Customer, attributes: ['name', 'email'] },
        { model: Bill, attributes: ['amount', 'date'] }
      ]
    });
    return res.status(200).json(payments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch payments' });
  }
}

async function getPaymentById(req, res) {
  try {
    const { id } = req.params;
    const payment = await Payment.findByPk(parseInt(id), {
      include: [
        { model: Customer, attributes: ['name', 'email'] },
        { model: Bill, attributes: ['amount', 'date'] }
      ]
    });
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    return res.status(200).json(payment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch payment details' });
  }
}

async function createPayment(req, res) {
  try {
    const { billId, customerId, amount, payment_method, receipt_number, status, invoiceId } = req.body;
    if (!billId || !customerId || !amount || !payment_method) {
      return res.status(400).json({ error: 'Missing required payment details' });
    }

    const newPayment = await Payment.create({
      amount: parseFloat(amount),
      payment_date: new Date(),
      payment_method,
      receipt_number: receipt_number || `REC${Date.now()}`,
      status: status || 'pending',
      customerId: parseInt(customerId),
      billId: parseInt(billId),
      invoiceId: invoiceId ? parseInt(invoiceId) : null, // Include invoiceId if provided
    });

    // Optionally update Bill and Invoice status if payment is completed
    if (newPayment.status === 'completed') {
      await Bill.update({ paymentStatus: 'paid' }, { where: { id: billId } });
      if (invoiceId) {
        await Invoice.update({ status: 'paid' }, { where: { id: invoiceId } });
      }
      clearCache('/api/reports*');
    }

    return res.status(201).json({ message: 'Payment created successfully', payment: newPayment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create payment' });
  }
}

async function updatePaymentStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, invoiceId } = req.body; // Assuming invoiceId might be passed to update corresponding invoice
    const [updatedRows] = await Payment.update({ status, updatedAt: new Date() }, {
      where: { id: parseInt(id) }
    });

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Payment not found or no changes made' });
    }

    const updatedPayment = await Payment.findByPk(parseInt(id));

    // Optionally update Bill and Invoice status based on new payment status
    if (updatedPayment && updatedPayment.billId) {
      if (status === 'completed') {
        await Bill.update({ paymentStatus: 'paid' }, { where: { id: updatedPayment.billId } });
        if (updatedPayment.invoiceId) {
          await Invoice.update({ status: 'paid' }, { where: { id: updatedPayment.invoiceId } });
        }
        clearCache('/api/reports*');
      }
 else if (status === 'failed' || status === 'pending') {
        // You might want to set bill/invoice status to 'unpaid' or 'pending' accordingly
        // For simplicity, this example only updates on 'completed'
      }
    }

    return res.status(200).json({ message: 'Payment status updated successfully', payment: updatedPayment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update payment status' });
  }
}

async function deletePayment(req, res) {
  try {
    const { id } = req.params;
    const deletedRows = await Payment.destroy({
      where: { id: parseInt(id) }
    });

    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    return res.status(204).send(); // No content for successful deletion
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete payment' });
  }
}

async function mpesaCallback(req, res) {
  try {
    console.log('M-Pesa Callback received:', req.body);
    const { MpesaReceiptNumber, Amount, BillRefNumber, MSISDN } = req.body; // Example fields from M-Pesa callback

    // Find bill based on BillRefNumber (assuming BillRefNumber corresponds to a Bill ID or Invoice ID)
    const bill = await Bill.findByPk(parseInt(BillRefNumber)); // Or Invoice.findOne based on BillRefNumber

    if (!bill) {
        return res.status(404).json({ error: 'Bill not found for M-Pesa callback' });
    }

    // Assuming customer ID can be derived from the Bill or MSISDN
    // For simplicity, let's use the customerId from the found bill
    const customer = await Customer.findByPk(bill.customerId);
    if (!customer) {
        return res.status(404).json({ error: 'Customer not found for M-Pesa callback' });
    }

    const newPayment = await Payment.create({
        amount: parseFloat(Amount),
        payment_date: new Date(),
        payment_method: 'mpesa',
        receipt_number: MpesaReceiptNumber,
        status: 'completed',
        customerId: customer.id,
        billId: bill.id,
        // Assuming invoiceId can be determined from bill or other logic
        // For now, leaving it null or finding it from the bill
        invoiceId: null, // Placeholder, actual logic needed to link to specific invoice if any
    });

    // Update bill status
    await Bill.update({ paymentStatus: 'paid' }, { where: { id: bill.id } });
    // If linked to an invoice, also update invoice status
    // await Invoice.update({ status: 'paid' }, { where: { id: newPayment.invoiceId } });
    
    clearCache('/api/reports*');


    return res.status(200).json({ message: 'M-Pesa callback processed successfully', payment: newPayment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to process M-Pesa callback' });
  }
}

module.exports = {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePaymentStatus,
  deletePayment,
  mpesaCallback,
};
