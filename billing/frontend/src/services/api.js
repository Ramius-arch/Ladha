import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const api = {
  apiClient,
  getCustomers(page = 1, pageSize = 10, search = '', sortBy = 'id', sortOrder = 'asc') {
    return apiClient.get('/customers', {
      params: { page, pageSize, search, sortBy, sortOrder }
    });
  },
  addCustomer(customer) {
    return apiClient.post('/customers', customer);
  },
  getCustomerById(id) {
    return apiClient.get(`/customers/${id}`);
  },
  updateCustomer(id, customer) {
    return apiClient.put(`/customers/${id}`, customer);
  },
  deleteCustomer(id) {
    return apiClient.delete(`/customers/${id}`);
  },
  getCustomerProfile() {
    return apiClient.get('/customers/me'); // Assuming an endpoint for current user profile
  },
  updateCustomerProfile(profileData) {
    return apiClient.put('/customers/me/update-profile', profileData);
  },

  getOrders() {
    return apiClient.get('/orders');
  },
  reconcileCommerce() {
    return apiClient.post('/commerce/reconcile');
  },
  sweepReservations(storeId = 'ladha-main') {
    return apiClient.post(`/stores/${storeId}/reservations/sweep`);
  },
  getTrialBalance() {
    return apiClient.get('/ledger/trial-balance');
  },
  getDiligenceMetrics() {
    return apiClient.get('/commerce/diligence/metrics');
  },
  downloadDiligenceDossierPdf() {
    return apiClient.get('/commerce/diligence/dossier-pdf', { responseType: 'blob' });
  },
  getLadhaProducts() {
    return apiClient.get('/ladha/products');
  },
  getPlans() {
    return apiClient.get('/plans'); // Assuming a /plans endpoint
  },

  generateBill(customerId) {
    return apiClient.post(`/billing/generate/${customerId}`);
  },

  getUsage(page = 1, pageSize = 10) {
    return apiClient.get('/usage', { params: { page, pageSize } });
  },
  addUsage(usage) {
    return apiClient.post('/usage', usage);
  },
  getUsageById(id) {
    return apiClient.get(`/usage/${id}`);
  },
  updateUsage(id, usage) {
    return apiClient.put(`/usage/${id}`, usage);
  },
  deleteUsage(id) {
    return apiClient.delete(`/usage/${id}`);
  },
  getUsageByCustomerId(customerId, page = 1, pageSize = 10) {
    return apiClient.get(`/usage/customer/${customerId}`, { params: { page, pageSize } });
  },
  getCallUsage() {
    return apiClient.get('/usage/type/call');
  },
  getSmsUsage() {
    return apiClient.get('/usage/type/sms');
  },

  getInvoices(page = 1, pageSize = 100) {
    return apiClient.get('/invoices', { params: { page, pageSize } });
  },
  getInvoiceById(id) {
    return apiClient.get(`/invoices/${id}`);
  },
  updateInvoiceStatus(id, status) {
    return apiClient.put(`/invoices/${id}/status`, status);
  },
  generateInvoice(invoiceData) {
    return apiClient.post('/invoices/generate-invoice', invoiceData);
  },
  getCustomerInvoices() {
    return apiClient.get('/invoices/me'); // Assuming an endpoint for current customer's invoices
  },
  downloadInvoicePdf(id) {
    return apiClient.get(`/invoices/${id}/pdf`, { responseType: 'blob' }); // Assuming PDF download
  },

  getPayments() {
    return apiClient.get('/payments');
  },
  getPaymentById(id) {
    return apiClient.get(`/payments/${id}`);
  },
  createPayment(paymentData) {
    return apiClient.post('/payments', paymentData);
  },
  updatePaymentStatus(id, status) {
    return apiClient.put(`/payments/${id}/status`, status);
  },
  deletePayment(id) {
    return apiClient.delete(`/payments/${id}`);
  },
  mpesaCallback(callbackData) {
    return apiClient.post('/payments/mpesa/callback', callbackData);
  },

  // Reports API calls
  reports: {
    getAllCustomersReport() {
      return apiClient.get('/reports/customers');
    },
    getBillingTrends(period = '30d') {
      return apiClient.get('/reports/billing-trends', { params: { period } });
    },
    getOutstandingDues() {
      return apiClient.get('/reports/outstanding-dues');
    },
    generateFinancialSummary(data) {
      return apiClient.post('/reports/financial-summary', data);
    },
    importMetrics(data) {
      return apiClient.post('/reports/import', data);
    },
    getUsageReports() {
      return apiClient.get('/reports/usage-reports');
    },
    getDetailedFinancialReport() {
      return apiClient.get('/reports/detailed-financial');
    },
    getCustomerUsageTrend() {
      return apiClient.get('/reports/customer-usage-trend');
    },
    getTopCustomers() {
      return apiClient.get('/reports/top-customers');
    },
  },

  getBillingForecast(customerId) {
    return apiClient.get(`/billing/forecast/${customerId}`);
  },

  async getDashboardData(period = '30d') {
    try {
      const [
        billingTrendsRes,
        usageReportsRes,
        outstandingDuesRes,
        // Add other relevant dashboard data calls here
      ] = await Promise.all([
        apiClient.get('/reports/billing-trends', { params: { period } }),
        apiClient.get('/reports/usage-reports'),
        apiClient.get('/reports/outstanding-dues'),
      ]);

      const billingTrends = billingTrendsRes.data?.data || {};
      const usageReports = usageReportsRes.data?.data || {};
      const outstandingDues = outstandingDuesRes.data?.data || [];

      return {
        data: {
          period: billingTrends.period || period,
          periodLabel: billingTrends.periodLabel || '',
          totalRevenue: billingTrends.totalRevenue || 0,
          allTimeRevenue: billingTrends.allTimeRevenue || billingTrends.totalRevenue || 0,
          ordersFulfilled: billingTrends.ordersFulfilled || usageReports.totalUsageDuration || 0,
          averageOrderValue: billingTrends.averageOrderValue || 0,
          trendData: billingTrends.trendData || [],
          totalDataUsage: usageReports.totalUsageDuration || 0,
          recentTransactions: billingTrends.recentTransactions || [],
          outstandingDuesSummary: outstandingDues || [],
          forecast: billingTrends.forecast || null
        }
      };
    } catch (error) {
      console.error('getDashboardData failed:', error);
      return {
        data: {
          totalRevenue: 0,
          totalDataUsage: 0,
          recentTransactions: [],
          outstandingDuesSummary: [],
          forecast: null
        }
      };
    }
  },

};

export default api;