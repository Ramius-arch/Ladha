const fs = require('fs');
const path = require('path');

const checkoutPath = path.resolve('storefront/checkout.html');
let content = fs.readFileSync(checkoutPath, 'utf8');

// Add jspdf script before checkout logic
if (!content.includes('js/etims-generator.js')) {
  content = content.replace(
    '<!-- Checkout Logic -->\r\n    <script>',
    `<!-- Invoice Generator & Checkout Logic -->\r\n    <script src="js/jspdf.umd.min.js"></script>\r\n    <script src="js/etims-generator.js"></script>\r\n    <script>`
  );
  if (!content.includes('js/etims-generator.js')) {
    // Try LF
    content = content.replace(
      '<!-- Checkout Logic -->\n    <script>',
      `<!-- Invoice Generator & Checkout Logic -->\n    <script src="js/jspdf.umd.min.js"></script>\n    <script src="js/etims-generator.js"></script>\n    <script>`
    );
  }
}

// Update confirm-etims-btn
const targetCode = `document.getElementById('confirm-etims-btn').href = \`http://localhost:5000/api/commerce/invoices/\${orderCode}/etims-pdf\`;`;
const replacementCode = `const currentOrderData = {
                        orderCode,
                        receiptCode,
                        customerName: \`\${firstName} \${lastName}\`,
                        customerPhone: phone,
                        deliveryZone: \`\${address}, \${region}\`,
                        cart: JSON.parse(JSON.stringify(cart)),
                        shippingFee
                    };
                    document.getElementById('confirm-etims-btn').onclick = (e) => {
                        e.preventDefault();
                        if (window.generateClientEtimsPdf) {
                            window.generateClientEtimsPdf(currentOrderData);
                        } else {
                            window.open(\`http://localhost:5000/api/commerce/invoices/\${orderCode}/etims-pdf\`, '_blank');
                        }
                    };`;

if (content.includes(targetCode)) {
  content = content.replace(targetCode, replacementCode);
  fs.writeFileSync(checkoutPath, content, 'utf8');
  console.log('Successfully patched storefront/checkout.html');
} else {
  console.log('targetCode not found, checking match...');
}
