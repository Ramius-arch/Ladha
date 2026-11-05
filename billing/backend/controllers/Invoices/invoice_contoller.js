const asyncHandler = require('../../middleware/asyncHandler');
const ErrorResponse = require('../../middleware/errorHandler').ErrorResponse;
const db = require('../../models');
const { clearCache } = require('../../middleware/cacheHandler');

const Invoice = db.Invoice;
const Bill = db.Bill;
const Customer = db.Customer;
const Plan = db.Plan;

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Private
exports.getInvoices = asyncHandler(async (req, res, next) => {
  const { status } = req.query;
  const query = {
    include: [{
      model: Bill,
      include: [
        { model: Customer, attributes: ['name', 'email'] },
        { model: Plan, attributes: ['name'] }
      ]
    }]
  };

  if (status) {
    query.where = { status };
  }

  const invoices = await Invoice.findAll(query);
  res.status(200).json({ success: true, count: invoices.length, data: invoices });
});

// @desc    Get single invoice with detailed breakdown
// @route   GET /api/invoices/:id
// @access  Private
exports.getInvoiceById = asyncHandler(async (req, res, next) => {
  const invoice = await Invoice.findByPk(req.params.id, {
    include: [{
      model: Bill,
      include: [
        { model: Customer, attributes: ['id', 'name', 'email', 'phone_number', 'address'] },
        { model: Plan }
      ]
    }]
  });

  if (!invoice) {
    throw new ErrorResponse(`Invoice not found with id of ${req.params.id}`, 404);
  }

  // Optimization: Fetch usage logs directly from UsageLog table for detailed breakdown
  const usageLogs = await db.UsageLog.findAll({
    where: {
      customerId: invoice.Bill?.customerId,
      planId: invoice.Bill?.planId,
      // Logic: Only logs that were created before the bill but not billed yet, 
      // or specifically linked via timestamp range. 
      // Simplified here for the demo context:
      createdAt: { [db.Op.lte]: invoice.Bill?.createdAt }
    },
    limit: 50 // Prevention of UI crash on massive datasets
  });

  // Innovation: Dynamic Itemization Breakdown for UI
  const details = {
    invoiceNumber: invoice.invoiceNumber,
    billDate: invoice.Bill?.date,
    amount: invoice.amountDue,
    status: invoice.status,
    customer: invoice.Bill?.Customer,
    plan: invoice.Bill?.Plan,
    usageLogs: usageLogs,
    // Calculated breakdown (assuming 16% VAT was included in amountDue)
    breakdown: {
      subtotal: invoice.amountDue / 1.16,
      tax: (invoice.amountDue / 1.16) * 0.16,
      total: invoice.amountDue
    }
  };

  res.status(200).json({ success: true, data: details });
});

// @desc    Update invoice status
// @route   PUT /api/invoices/:id/status
// @access  Private
exports.updateInvoiceStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  let invoice = await Invoice.findByPk(req.params.id);

  if (!invoice) {
    throw new ErrorResponse('Invoice not found', 404);
  }

  invoice = await invoice.update({ status });
  clearCache('/api/reports*');
  res.status(200).json({ success: true, data: invoice });
});

// @desc    Generate a one-off invoice
// @route   POST /api/invoices/generate-invoice
// @access  Private
exports.generateInvoice = asyncHandler(async (req, res, next) => {
  const { billId, dueDate, amountDue } = req.body;

  let bill;
  if (billId) {
    bill = await Bill.findByPk(billId);
  }

  if (!bill) {
    throw new ErrorResponse('No associated bill found for this transaction', 404);
  }

  const invoice = await Invoice.create({
    billId: bill.id,
    invoiceNumber: `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    issueDate: new Date(),
    dueDate: new Date(dueDate || new Date().setDate(new Date().getDate() + 14)),
    amountDue: parseFloat(amountDue) || bill.totalAmount,
    status: 'pending'
  });

  clearCache('/api/reports*');

  res.status(201).json({ success: true, data: invoice });
});

// @desc    Generate PDF for invoice (Mock)
// @route   GET /api/invoices/:id/pdf
// @access  Private
exports.generatePDF = asyncHandler(async (req, res, next) => {
  const invoice = await Invoice.findByPk(req.params.id);
  if (!invoice) {
    throw new ErrorResponse('Invoice not found', 404);
  }

  // Placeholder for real PDF logic
  const pdfPath = `/generated/invoices/${invoice.invoiceNumber}.pdf`;
  await invoice.update({ pdfPath });

  res.status(200).json({ success: true, message: 'PDF generated', pdfPath });
});
