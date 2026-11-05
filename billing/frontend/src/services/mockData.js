/**
 * Ladha Ledger — Autonomous Standalone Client-Side Data Store
 * Provides instant, zero-latency realistic mock data when running in frontend-only mode.
 */

const STORAGE_KEYS = {
  CUSTOMERS: 'ladha_mock_customers',
  INVOICES: 'ladha_mock_invoices',
  ORDERS: 'ladha_mock_orders',
  PAYMENTS: 'ladha_mock_payments',
  ACCOUNTS: 'ladha_mock_accounts',
};

const DEFAULT_PLANS = [
  { id: 1, name: 'VIP Archival Collector', price: 0 },
  { id: 2, name: 'Nairobi Streetwear Patron', price: 0 },
  { id: 3, name: 'Wholesale & Boutique Partner', price: 0 }
];

const DEFAULT_CUSTOMERS = [
  { id: 1, name: 'Kevin Ochieng', email: 'kevin.ochieng@gmail.com', phone_number: '+254 712 345 678', address: 'Kilimani, Nairobi', status: 'active', planId: 1, Plan: DEFAULT_PLANS[0], createdAt: '2026-10-12T10:00:00Z' },
  { id: 2, name: 'Amina Wambui', email: 'amina.wambui@yahoo.com', phone_number: '+254 722 998 877', address: 'Westlands, Nairobi', status: 'active', planId: 1, Plan: DEFAULT_PLANS[0], createdAt: '2026-10-14T11:20:00Z' },
  { id: 3, name: 'Brian Mutua', email: 'brian.mutua@outlook.com', phone_number: '+254 733 456 789', address: 'CBD, Nairobi', status: 'active', planId: 2, Plan: DEFAULT_PLANS[1], createdAt: '2026-10-15T09:15:00Z' },
  { id: 4, name: 'Faith Chebet', email: 'faith.chebet@gmail.com', phone_number: '+254 701 234 567', address: 'Karen, Nairobi', status: 'active', planId: 1, Plan: DEFAULT_PLANS[0], createdAt: '2026-10-18T14:40:00Z' },
  { id: 5, name: 'Ian Macharia', email: 'ian.macharia@icloud.com', phone_number: '+254 711 556 677', address: 'Lavington, Nairobi', status: 'active', planId: 2, Plan: DEFAULT_PLANS[1], createdAt: '2026-10-20T16:05:00Z' },
  { id: 6, name: 'Stephanie Njeri', email: 'stephanie.njeri@gmail.com', phone_number: '+254 720 112 233', address: 'Kileleshwa, Nairobi', status: 'active', planId: 1, Plan: DEFAULT_PLANS[0], createdAt: '2026-10-22T08:30:00Z' },
  { id: 7, name: 'David Kimani', email: 'david.kimani@gmail.com', phone_number: '+254 798 334 455', address: 'Runda, Nairobi', status: 'active', planId: 3, Plan: DEFAULT_PLANS[2], createdAt: '2026-10-24T12:00:00Z' },
  { id: 8, name: 'Brenda Achieng', email: 'brenda.achieng@yahoo.com', phone_number: '+254 715 667 788', address: 'Parklands, Nairobi', status: 'active', planId: 2, Plan: DEFAULT_PLANS[1], createdAt: '2026-10-26T15:10:00Z' },
  { id: 9, name: 'Dennis Kiprop', email: 'dennis.kiprop@gmail.com', phone_number: '+254 723 889 900', address: 'South C, Nairobi', status: 'active', planId: 1, Plan: DEFAULT_PLANS[0], createdAt: '2026-10-28T17:45:00Z' },
  { id: 10, name: 'Yvonne Muthoni', email: 'yvonne.muthoni@gmail.com', phone_number: '+254 705 443 322', address: 'Ngong Road, Nairobi', status: 'active', planId: 2, Plan: DEFAULT_PLANS[1], createdAt: '2026-10-30T10:50:00Z' },
  { id: 11, name: 'Victor Omondi', email: 'victor.omondi@gmail.com', phone_number: '+254 710 889 911', address: 'Upper Hill, Nairobi', status: 'active', planId: 3, Plan: DEFAULT_PLANS[2], createdAt: '2026-11-01T13:15:00Z' },
  { id: 12, name: 'Grace Wanjiku', email: 'grace.wanjiku@gmail.com', phone_number: '+254 728 554 433', address: 'Muthaiga, Nairobi', status: 'active', planId: 1, Plan: DEFAULT_PLANS[0], createdAt: '2026-11-02T16:20:00Z' }
];

const DEFAULT_ORDERS = [
  { id: 101, orderNumber: 'LDH-DRP-8801', customerName: 'Kevin Ochieng', customerId: 1, totalAmount: 8500, status: 'fulfilled', paymentMethod: 'M-Pesa STK', mpesaReceipt: 'QKF88291LA', createdAt: '2026-11-04T14:22:00Z', items: [{ name: 'Archival Heavy Bomber Jacket', qty: 1, price: 8500 }] },
  { id: 102, orderNumber: 'LDH-DRP-8802', customerName: 'Amina Wambui', customerId: 2, totalAmount: 4200, status: 'fulfilled', paymentMethod: 'M-Pesa STK', mpesaReceipt: 'QKF88292LA', createdAt: '2026-11-04T15:10:00Z', items: [{ name: 'Raw Edge Oversized Hoodie', qty: 1, price: 4200 }] },
  { id: 103, orderNumber: 'LDH-DRP-8803', customerName: 'Faith Chebet', customerId: 4, totalAmount: 12500, status: 'fulfilled', paymentMethod: 'M-Pesa Paybill', mpesaReceipt: 'QKF88293LA', createdAt: '2026-11-04T16:45:00Z', items: [{ name: 'Ladha Tactical Cargo Pants', qty: 1, price: 5500 }, { name: 'Acid Wash Boxy Tee', qty: 2, price: 3500 }] },
  { id: 104, orderNumber: 'LDH-DRP-8804', customerName: 'Brian Mutua', customerId: 3, totalAmount: 3500, status: 'fulfilled', paymentMethod: 'M-Pesa STK', mpesaReceipt: 'QKF88294LA', createdAt: '2026-11-05T09:12:00Z', items: [{ name: 'Acid Wash Boxy Tee', qty: 1, price: 3500 }] },
  { id: 105, orderNumber: 'LDH-DRP-8805', customerName: 'David Kimani', customerId: 7, totalAmount: 18000, status: 'pending', paymentMethod: 'M-Pesa STK', mpesaReceipt: 'QKF88295LA', createdAt: '2026-11-05T11:30:00Z', items: [{ name: 'Wholesale B2B Archival Bundle (5 pcs)', qty: 1, price: 18000 }] },
  { id: 106, orderNumber: 'LDH-DRP-8806', customerName: 'Stephanie Njeri', customerId: 6, totalAmount: 4200, status: 'fulfilled', paymentMethod: 'M-Pesa STK', mpesaReceipt: 'QKF88296LA', createdAt: '2026-11-05T12:45:00Z', items: [{ name: 'Raw Edge Oversized Hoodie', qty: 1, price: 4200 }] }
];

const DEFAULT_INVOICES = [
  { id: 1, invoiceNumber: 'INV-2026-001', customerName: 'Kevin Ochieng', customerId: 1, amount: 8500, vatAmount: 1172.41, subtotal: 7327.59, kraCuNumber: 'KRA-ETIMS-2026-000491', status: 'paid', dueDate: '2026-11-10', createdAt: '2026-11-04T14:22:00Z' },
  { id: 2, invoiceNumber: 'INV-2026-002', customerName: 'Amina Wambui', customerId: 2, amount: 4200, vatAmount: 579.31, subtotal: 3620.69, kraCuNumber: 'KRA-ETIMS-2026-000492', status: 'paid', dueDate: '2026-11-10', createdAt: '2026-11-04T15:10:00Z' },
  { id: 3, invoiceNumber: 'INV-2026-003', customerName: 'Faith Chebet', customerId: 4, amount: 12500, vatAmount: 1724.14, subtotal: 10775.86, kraCuNumber: 'KRA-ETIMS-2026-000493', status: 'paid', dueDate: '2026-11-11', createdAt: '2026-11-04T16:45:00Z' },
  { id: 4, invoiceNumber: 'INV-2026-004', customerName: 'Brian Mutua', customerId: 3, amount: 3500, vatAmount: 482.76, subtotal: 3017.24, kraCuNumber: 'KRA-ETIMS-2026-000494', status: 'paid', dueDate: '2026-11-11', createdAt: '2026-11-05T09:12:00Z' },
  { id: 5, invoiceNumber: 'INV-2026-005', customerName: 'David Kimani', customerId: 7, amount: 18000, vatAmount: 2482.76, subtotal: 15517.24, kraCuNumber: 'KRA-ETIMS-2026-000495', status: 'pending', dueDate: '2026-11-15', createdAt: '2026-11-05T11:30:00Z' }
];

const DEFAULT_ACCOUNTS = [
  { id: 1, code: '1100', name: 'M-Pesa Clearing & Settlement', type: 'asset', debit: 113000, credit: 0, balance: 113000 },
  { id: 2, code: '1200', name: 'Accounts Receivable (Shoppers)', type: 'asset', debit: 18000, credit: 18000, balance: 0 },
  { id: 3, code: '2200', name: 'KRA Output VAT Payable (16%)', type: 'liability', debit: 0, credit: 15586.21, balance: 15586.21 },
  { id: 4, code: '4000', name: 'Sales Revenue - Archival Streetwear', type: 'revenue', debit: 0, credit: 91413.79, balance: 91413.79 },
  { id: 5, code: '4100', name: 'Courier & Logistics Tariffs Income', type: 'revenue', debit: 0, credit: 6000, balance: 6000 }
];

function getStored(key, defaultVal) {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
}

function setStored(key, val) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {}
}

export const MockStore = {
  getCustomers(page = 1, pageSize = 10, search = '') {
    let list = getStored(STORAGE_KEYS.CUSTOMERS, DEFAULT_CUSTOMERS);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.phone_number && c.phone_number.includes(q)));
    }
    const total = list.length;
    const start = (page - 1) * pageSize;
    const paginated = list.slice(start, start + pageSize);
    return { customers: paginated, totalItems: total, currentPage: page, totalPages: Math.ceil(total / pageSize) };
  },

  addCustomer(customerData) {
    const list = getStored(STORAGE_KEYS.CUSTOMERS, DEFAULT_CUSTOMERS);
    const newCust = {
      id: Date.now(),
      status: 'active',
      planId: customerData.planId || 1,
      Plan: DEFAULT_PLANS.find(p => p.id === (customerData.planId || 1)) || DEFAULT_PLANS[0],
      createdAt: new Date().toISOString(),
      ...customerData
    };
    list.unshift(newCust);
    setStored(STORAGE_KEYS.CUSTOMERS, list);
    return newCust;
  },

  updateCustomer(id, data) {
    let list = getStored(STORAGE_KEYS.CUSTOMERS, DEFAULT_CUSTOMERS);
    list = list.map(c => c.id === Number(id) ? { ...c, ...data } : c);
    setStored(STORAGE_KEYS.CUSTOMERS, list);
    return list.find(c => c.id === Number(id));
  },

  deleteCustomer(id) {
    let list = getStored(STORAGE_KEYS.CUSTOMERS, DEFAULT_CUSTOMERS);
    list = list.filter(c => c.id !== Number(id));
    setStored(STORAGE_KEYS.CUSTOMERS, list);
    return true;
  },

  getPlans() {
    return DEFAULT_PLANS;
  },

  getInvoices(page = 1, pageSize = 20) {
    const list = getStored(STORAGE_KEYS.INVOICES, DEFAULT_INVOICES);
    return { invoices: list, totalItems: list.length };
  },

  getOrders() {
    return getStored(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
  },

  getTrialBalance() {
    const accounts = DEFAULT_ACCOUNTS;
    const totalDebits = accounts.reduce((acc, a) => acc + a.debit, 0);
    const totalCredits = accounts.reduce((acc, a) => acc + a.credit, 0);
    return {
      accounts,
      totalDebits,
      totalCredits,
      isBalanced: Math.abs(totalDebits - totalCredits) < 0.01,
      variance: 0.00
    };
  },

  getDashboardData(period = '30d') {
    return {
      period,
      periodLabel: period === '7d' ? 'Last 7 Days (Daily)' : period === '30d' ? 'Last 30 Days (Weekly Velocity)' : 'Last 12 Months',
      totalRevenue: 113000,
      allTimeRevenue: 113000,
      ordersFulfilled: 28,
      averageOrderValue: 4036,
      trendData: [
        { label: 'Week 1', revenue: 14000 },
        { label: 'Week 2', revenue: 18500 },
        { label: 'Week 3', revenue: 22500 },
        { label: 'Week 4', revenue: 26800 },
        { label: 'Current', revenue: 31200 }
      ],
      totalDataUsage: 28,
      recentTransactions: [
        { id: 'TX-901', mpesaReceipt: 'QKF88291LA', customer: 'Kevin Ochieng', amount: 8500, time: '14 mins ago', status: 'verified' },
        { id: 'TX-902', mpesaReceipt: 'QKF88292LA', customer: 'Amina Wambui', amount: 4200, time: '1 hour ago', status: 'verified' },
        { id: 'TX-903', mpesaReceipt: 'QKF88293LA', customer: 'Faith Chebet', amount: 12500, time: '3 hours ago', status: 'verified' }
      ],
      outstandingDuesSummary: [
        { customerName: 'David Kimani', invoiceNumber: 'INV-2026-005', amount: 18000, dueDate: '2026-11-15' }
      ],
      forecast: { projectedMonthly: 142000, growthRate: 18.5 }
    };
  }
};
