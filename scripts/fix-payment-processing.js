const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, '../billing/frontend/src/pages/PaymentProcessing.vue');
let c = fs.readFileSync(p, 'utf8');

c = c.replace("paymentMethod = ref('credit_card')", "paymentMethod = ref('mpesa')");
c = c.replace(
  "invoices.value = response.data.invoices || [];",
  "invoices.value = response.data?.data || response.data?.invoices || [];"
);
c = c.replace(
  "option.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0;",
  "String(option.children?.[0] || '').toLowerCase().indexOf(String(input || '').toLowerCase()) >= 0;"
);

// Also update currency and template styling for selected invoice
c = c.replace("KSh {{ selectedInvoice.amountDue.toLocaleString() }}", "KES {{ Number(selectedInvoice.amountDue || selectedInvoice.total || 0).toLocaleString() }}");
c = c.replace("{{ invoice.invoiceNumber }} - {{ invoice.Customer?.name }} (KSh {{ invoice.amountDue }})", "{{ invoice.invoiceNumber }} - {{ invoice.Customer?.name || 'Shopper' }} (KES {{ Number(invoice.amountDue || invoice.total || 0).toLocaleString() }})");

fs.writeFileSync(p, c, 'utf8');
console.log('PaymentProcessing.vue updated successfully');
