const { jsPDF } = require('../billing/frontend/node_modules/jspdf');
const fs = require('fs');

const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'pt',
  format: 'a4'
});

doc.setFont('helvetica', 'bold');
doc.setFontSize(16);
doc.text('LADHA CAPITAL DUE DILIGENCE DOSSIER', 40, 50);

doc.setFont('helvetica', 'normal');
doc.setFontSize(10);
doc.text('Double-Entry General Ledger Audited • KRA eTIMS Tax Compliant', 40, 70);

const arrayBuffer = doc.output('arraybuffer');
const buffer = Buffer.from(arrayBuffer);

fs.writeFileSync('scripts/test-output.pdf', buffer);

console.log('PDF written. Size in bytes:', buffer.length);
console.log('PDF header magic bytes:', buffer.slice(0, 8).toString());
console.log('PDF tail (last 16 bytes):', buffer.slice(-16).toString());
