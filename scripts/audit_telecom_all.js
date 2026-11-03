const fs = require('fs');
const path = require('path');

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const hits = [];
  lines.forEach((l, idx) => {
    if (/(calls?|sms|minutes|telecom|airtime|gigabyte|voice)/i.test(l) && !l.includes('//') && !l.includes('/*')) {
      hits.push({ line: idx + 1, text: l.trim() });
    }
  });
  if (hits.length > 0) {
    console.log(`\n=== ${filePath} (${hits.length} occurrences) ===`);
    hits.slice(0, 10).forEach(h => console.log(`  L${h.line}: ${h.text}`));
  }
}

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const full = path.join(dir, item);
    if (item === 'node_modules' || item === '.git' || item === 'dist') continue;
    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else if (item.endsWith('.vue') || item.endsWith('.js')) {
      checkFile(full);
    }
  }
}

walk('billing/frontend/src');
