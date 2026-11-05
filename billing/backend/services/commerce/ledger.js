/**
 * Double-Entry Accounting Ledger Engine
 * Enforces fundamental accounting equation: Total Debits == Total Credits
 */

const db = require('../../models');
const LedgerAccount = db.LedgerAccount;
const JournalEntry = db.JournalEntry;
const JournalLine = db.JournalLine;

// Standard Chart of Accounts
const STANDARD_ACCOUNTS = [
  { code: '1100', name: 'M-Pesa Clearing & Settlement', type: 'asset', description: 'Real-time clearing account for incoming mobile money payments' },
  { code: '1200', name: 'Accounts Receivable', type: 'asset', description: 'Pending client settlements and invoicing balances' },
  { code: '2200', name: 'VAT Output Tax Payable (16%)', type: 'liability', description: 'Kenya Revenue Authority (KRA) output tax collected on goods & delivery' },
  { code: '4000', name: 'Sales - Archival Streetwear', type: 'revenue', description: 'Net sales revenue from physical garments and fashion collections' },
  { code: '4100', name: 'Delivery & Logistics Income', type: 'revenue', description: 'Income from courier shipping tariffs across Nairobi' },
  { code: '4200', name: 'SaaS Platform & Telemetry Income', type: 'revenue', description: 'Recurring subscription and API metering income' },
  { code: '4900', name: 'Sales Returns & Customer Refunds', type: 'revenue', description: 'Contra-revenue account for refunded orders' }
];

let accountsInitialized = false;

/**
 * Ensures standard chart of accounts exists in database
 */
async function ensureAccounts() {
  if (accountsInitialized) return;
  for (const acc of STANDARD_ACCOUNTS) {
    await LedgerAccount.findOrCreate({
      where: { code: acc.code },
      defaults: acc
    }).catch(() => {});
  }
  accountsInitialized = true;
}

/**
 * Posts an immutable, balanced Double-Entry Journal Entry
 * @param {Object} entry
 * @param {string} entry.reference Unique reference code (e.g., JE-ORD-1234)
 * @param {string} entry.description Purpose of transaction
 * @param {string} entry.sourceType e.g., 'order', 'payment', 'refund'
 * @param {string} entry.sourceId Triggering order/payment ID
 * @param {Array<{ accountCode: string, debit?: number, credit?: number, description?: string }>} entry.lines
 */
async function postJournalEntry({ reference, description, sourceType, sourceId, lines }) {
  await ensureAccounts();

  let totalDebit = 0;
  let totalCredit = 0;

  lines.forEach(line => {
    totalDebit += Number(line.debit) || 0;
    totalCredit += Number(line.credit) || 0;
  });

  // Strict double-entry balance check (within 1 cent float tolerance)
  const diff = Math.abs(totalDebit - totalCredit);
  if (diff > 0.01) {
    throw new Error(`Double-entry balance violation: Debits (KES ${totalDebit.toFixed(2)}) != Credits (KES ${totalCredit.toFixed(2)}). Entry rejected.`);
  }

  // Pre-fetch account IDs
  const accountsByCode = {};
  for (const line of lines) {
    if (!accountsByCode[line.accountCode]) {
      const acc = await LedgerAccount.findOne({ where: { code: line.accountCode } });
      if (!acc) {
        throw new Error(`Ledger account with code ${line.accountCode} does not exist.`);
      }
      accountsByCode[line.accountCode] = acc;
    }
  }

  // Record entry in transactional database
  const entryNumber = reference || `JE-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

  const journalEntry = await JournalEntry.create({
    entryNumber,
    entryDate: new Date(),
    description,
    sourceType,
    sourceId: String(sourceId || ''),
    totalAmount: Math.round(totalDebit * 100) / 100
  });

  const createdLines = [];
  for (const line of lines) {
    const acc = accountsByCode[line.accountCode];
    const journalLine = await JournalLine.create({
      journalEntryId: journalEntry.id,
      accountId: acc.id,
      debit: Math.round((Number(line.debit) || 0) * 100) / 100,
      credit: Math.round((Number(line.credit) || 0) * 100) / 100,
      description: line.description || description
    });
    createdLines.push(journalLine);
  }

  return {
    journalEntry,
    lines: createdLines,
    balanced: true,
    total: journalEntry.totalAmount
  };
}

/**
 * Returns comprehensive Trial Balance to audit ledger health
 */
async function getTrialBalance() {
  await ensureAccounts();

  const accounts = await LedgerAccount.findAll({
    include: [{ model: JournalLine }]
  });

  let totalDebits = 0;
  let totalCredits = 0;

  const rows = accounts.map(acc => {
    const lines = acc.JournalLines || [];
    const debits = lines.reduce((s, l) => s + (l.debit || 0), 0);
    const credits = lines.reduce((s, l) => s + (l.credit || 0), 0);
    totalDebits += debits;
    totalCredits += credits;

    // Net balance according to normal balance of account type
    let netBalance = 0;
    if (acc.type === 'asset' || acc.type === 'expense') {
      netBalance = debits - credits;
    } else {
      netBalance = credits - debits;
    }

    return {
      code: acc.code,
      name: acc.name,
      type: acc.type,
      totalDebits: Math.round(debits * 100) / 100,
      totalCredits: Math.round(credits * 100) / 100,
      netBalance: Math.round(netBalance * 100) / 100
    };
  });

  const diff = Math.abs(totalDebits - totalCredits);

  return {
    asOf: new Date().toISOString(),
    isBalanced: diff <= 0.05,
    totalDebits: Math.round(totalDebits * 100) / 100,
    totalCredits: Math.round(totalCredits * 100) / 100,
    variance: Math.round(diff * 100) / 100,
    accounts: rows
  };
}

/**
 * Posts an immutable, balanced Double-Entry Contra/Reversal Journal Entry for an Order Refund
 * Reverses revenue, sales tax, and cash balances strictly balancing Debits == Credits.
 * @param {Object} options
 * @param {string} options.orderNumber Target order number (e.g., 'LDH-8921-KE')
 * @param {string} options.reason Reason for refund or return
 * @param {number} [options.refundAmount] Net amount to refund (defaults to full order total)
 * @param {boolean} [options.refundDelivery] Whether delivery tariff is also refunded (default: false)
 * @returns {Promise<{ reversalEntry: Object, lines: Array, balanced: boolean, totalRefunded: number }>}
 */
async function postReversalEntry({ orderNumber, reason = 'Customer refund / return', refundAmount = null, refundDelivery = false }) {
  await ensureAccounts();

  // Check if already reversed
  const existingReversal = await JournalEntry.findOne({
    where: { sourceType: 'reversal', sourceId: orderNumber }
  });
  if (existingReversal) {
    throw new Error(`Order ${orderNumber} has already been reversed in the ledger (${existingReversal.entryNumber}).`);
  }

  // Look up Order
  const order = await db.Order.findOne({ where: { orderNumber } });
  if (!order) {
    throw new Error(`Order ${orderNumber} not found.`);
  }

  const pricing = require('./pricing');
  const totalRefund = refundAmount ? Number(refundAmount) : Number(order.total);
  const deliveryPortion = (refundDelivery && order.shippingTotal > 0) ? Number(order.shippingTotal) : 0;
  const goodsPortion = Math.max(0, totalRefund - deliveryPortion);

  // Compute Net & VAT components
  const netGoods = Math.round((goodsPortion / (1 + pricing.VAT_RATE)) * 100) / 100;
  const netDelivery = Math.round((deliveryPortion / (1 + pricing.VAT_RATE)) * 100) / 100;
  const vatGoods = Math.round((goodsPortion - netGoods) * 100) / 100;
  const vatDelivery = Math.round((deliveryPortion - netDelivery) * 100) / 100;
  const totalVatReversed = Math.round((vatGoods + vatDelivery) * 100) / 100;

  // Build balanced contra-reversal lines:
  // Debit 4900 (Contra-Revenue) + Debit 2200 (VAT reduction) === Credit 1100 (Cash/M-Pesa Outflow)
  const reversalLines = [
    {
      accountCode: '4900',
      debit: netGoods,
      credit: 0,
      description: `Sales return contra-revenue for Order ${orderNumber}`
    },
    {
      accountCode: '2200',
      debit: totalVatReversed,
      credit: 0,
      description: `KRA 16% Output VAT reversal on refunded Order ${orderNumber}`
    }
  ];

  if (deliveryPortion > 0 && netDelivery > 0) {
    reversalLines.push({
      accountCode: '4100',
      debit: netDelivery,
      credit: 0,
      description: `Delivery courier tariff refunded for Order ${orderNumber}`
    });
  }

  // Credit 1100: Cash outflow / M-Pesa refund disbursement
  reversalLines.push({
    accountCode: '1100',
    debit: 0,
    credit: totalRefund,
    description: `M-Pesa settlement refund to customer for Order ${orderNumber}`
  });

  const reversalReference = `JE-REV-${orderNumber}-${Math.floor(100 + Math.random() * 900)}`;

  const result = await postJournalEntry({
    reference: reversalReference,
    description: `Contra-Ledger Reversal for Order ${orderNumber}: ${reason}`,
    sourceType: 'reversal',
    sourceId: orderNumber,
    lines: reversalLines
  });

  return {
    reversalEntry: result.journalEntry,
    lines: result.lines,
    balanced: true,
    totalRefunded: totalRefund
  };
}

module.exports = {
  STANDARD_ACCOUNTS,
  ensureAccounts,
  postJournalEntry,
  postReversalEntry,
  getTrialBalance
};
