const fs = require('fs');
const path = require('path');

const filePath = path.resolve('storefront/js/etims-generator.js');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  `  const filename = \`LADHA_eTIMS_\${orderRef}.pdf\`;
  doc.save(filename);`,
  `  const filename = \`LADHA_eTIMS_\${orderRef}.pdf\`;
  const blob = doc.output('blob');
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Updated etims-generator.js to use explicit Blob download.');
