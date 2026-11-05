const fs = require('fs');
const path = require('path');

// 1. Update api.js
const apiPath = path.resolve('billing/frontend/src/services/api.js');
let apiContent = fs.readFileSync(apiPath, 'utf8');

const oldDiligenceCode = `  async downloadDiligenceDossierPdf() {
    try {
      return await apiClient.get('/commerce/diligence/dossier-pdf', { responseType: 'blob' });
    } catch (err) {
      console.info('Compiling client-side institutional diligence PDF via jsPDF...');
      const doc = createDiligenceDossierDoc();
      const blob = doc.output('blob');
      return { data: blob };
    }
  },`;

const newDiligenceCode = `  async downloadDiligenceDossierPdf() {
    try {
      const res = await apiClient.get('/commerce/diligence/dossier-pdf', { responseType: 'blob' });
      if (res && res.data && res.data.size > 100) {
        const header = await res.data.slice(0, 5).text();
        if (header.startsWith('%PDF-')) {
          return { data: res.data };
        }
      }
      console.warn('Backend returned non-PDF or SPA catchall HTML, generating client-side diligence PDF...');
    } catch (err) {
      console.warn('Backend diligence PDF API unavailable, generating client-side diligence PDF...');
    }

    const doc = createDiligenceDossierDoc();
    const blob = doc.output('blob');
    return { data: blob };
  },`;

const oldInvoiceCode = `  async downloadInvoicePdf(id) {
    try {
      return await apiClient.get(\`/invoices/\${id}/download-pdf\`, { responseType: 'blob' });
    } catch (err) {
      console.info('Compiling client-side KRA eTIMS invoice PDF via jsPDF...');
      const list = MockStore.getInvoices().invoices;
      const inv = list.find(i => i.id === Number(id)) || list[0] || {};
      const doc = createEtimsInvoiceDoc(inv);
      const blob = doc.output('blob');
      return { data: blob };
    }
  },`;

const newInvoiceCode = `  async downloadInvoicePdf(id) {
    try {
      const res = await apiClient.get(\`/invoices/\${id}/download-pdf\`, { responseType: 'blob' });
      if (res && res.data && res.data.size > 100) {
        const header = await res.data.slice(0, 5).text();
        if (header.startsWith('%PDF-')) {
          return { data: res.data };
        }
      }
      console.warn('Backend returned non-PDF for invoice, generating client-side eTIMS PDF...');
    } catch (err) {
      console.warn('Backend invoice PDF API unavailable, generating client-side eTIMS PDF...');
    }

    const list = MockStore.getInvoices().invoices;
    const inv = list.find(i => i.id === Number(id)) || list[0] || {};
    const doc = createEtimsInvoiceDoc(inv);
    const blob = doc.output('blob');
    return { data: blob };
  },`;

// Normalize line endings for replacement
apiContent = apiContent.replace(/\r\n/g, '\n');
apiContent = apiContent.replace(oldDiligenceCode.replace(/\r\n/g, '\n'), newDiligenceCode.replace(/\r\n/g, '\n'));
apiContent = apiContent.replace(oldInvoiceCode.replace(/\r\n/g, '\n'), newInvoiceCode.replace(/\r\n/g, '\n'));
apiContent = apiContent.replace(/\n/g, '\r\n');
fs.writeFileSync(apiPath, apiContent, 'utf8');
console.log('1. Updated api.js with PDF header validation.');

// 2. Update Dashboard.vue
const dashPath = path.resolve('billing/frontend/src/pages/Dashboard.vue');
let dashContent = fs.readFileSync(dashPath, 'utf8');

dashContent = dashContent.replace(
  '<button class="hero-action-pill secondary" @click="exportReport">',
  '<button class="hero-action-pill secondary" @click="handleExportDossier">'
);
fs.writeFileSync(dashPath, dashContent, 'utf8');
console.log('2. Updated Dashboard.vue hero action to handleExportDossier.');
