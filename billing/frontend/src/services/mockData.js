/**
 * @deprecated [DEPRECATED / ARCHIVED PROTOTYPE]
 * This static mock file is preserved for historical unit test reference only.
 * Production Ladha Ledger runs live against real PostgreSQL/SQLite double-entry ledgers,
 * Safaricom M-Pesa Daraja callbacks, and KRA eTIMS services via src/services/api.js.
 */
// frontend/src/services/mockData.js

const customers = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
  { id: 3, name: 'Alice Johnson', email: 'alice.j@example.com' },
];

const usageLogs = [
  { id: 1, customerId: 1, customerName: 'John Doe', retailOrders: 4, courierFee: 450, apiRequests: 120, timestamp: '2026-01-05T10:00:00Z' },
  { id: 2, customerId: 2, customerName: 'Jane Smith', retailOrders: 4, courierFee: 450, apiRequests: 120, timestamp: '2026-01-06T11:00:00Z' },
  { id: 3, customerId: 1, customerName: 'John Doe', retailOrders: 4, courierFee: 450, apiRequests: 120, timestamp: '2026-01-07T12:00:00Z' },
];

const invoices = [
  { id: 1, invoiceNumber: 'INV-001', customerId: 1, customerName: 'John Doe', amountDue: 100, dueDate: '2026-01-15', status: 'pending' },
  { id: 2, invoiceNumber: 'INV-002', customerId: 2, customerName: 'Jane Smith', amountDue: 250, dueDate: '2026-01-20', status: 'pending' },
  { id: 3, invoiceNumber: 'INV-003', customerId: 1, customerName: 'John Doe', amountDue: 50, dueDate: '2026-01-01', status: 'overdue' },
  { id: 4, invoiceNumber: 'INV-004', customerId: 2, customerName: 'Jane Smith', amountDue: 150, dueDate: '2025-12-25', status: 'paid' },
];

const payments = [
  { id: 1, customerId: 1, customerName: 'John Doe', amount: 100, payment_date: '2026-01-10', status: 'completed' },
  { id: 2, customerId: 2, customerName: 'Jane Smith', amount: 250, payment_date: '2026-01-18', status: 'pending' },
];

const billingTrendsData = {
  totalRevenue: 350000,
  recentRevenue: 180000,
  trendData: [{ month: 'Oct', revenue: 150 }, { month: 'Nov', revenue: 200 }, { month: 'Dec', revenue: 250 }],
  recentTransactions: [
    { id: 1, description: 'Payment from John Doe', date: '2026-01-08', status: 'Completed' },
    { id: 2, description: 'Invoice #INV-002 sent to Jane Smith', date: '2026-01-07', status: 'Pending' },
    { id: 3, description: 'New customer registration: Alice Johnson', date: '2026-01-06', status: 'Completed' },
  ],
};

const usageReportsData = {
  activeCustomers: 3,
  totalRetailOrders: 320,
  totalCourierTariffs: 85000,
  totalApiRequests: 45000
  // Add other relevant usage report data
};

const outstandingDuesData = invoices.filter(inv => inv.status === 'pending' || inv.status === 'overdue');

export default {
  customers,
  usageLogs,
  invoices,
  payments,
  reports: {
    getBillingTrends: billingTrendsData,
    getUsageReports: usageReportsData,
    getOutstandingDues: outstandingDuesData,
    getAllCustomersReport: customers.map(c => ({
      ...c,
      totalUsage: usageLogs.filter(log => log.customerId === c.id).reduce((acc, log) => acc + log.duration, 0),
      outstandingInvoices: invoices.filter(inv => inv.customerId === c.id && (inv.status === 'pending' || inv.status === 'overdue')).reduce((acc, inv) => acc + inv.amountDue, 0),
    })),
  },
};
