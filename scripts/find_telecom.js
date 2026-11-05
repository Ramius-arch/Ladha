const fs = require('fs');
const path = require('path');

function searchMatches(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (file === 'node_modules' || file === '.git' || file === 'dist') continue;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      searchMatches(fullPath);
    } else if (file.endsWith('.vue') || file.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (/(\bcalls?\b|\bsms\b|\btelecom\b|\bminutes\b|\bairtime\b)/i.test(line) && !line.includes('//') && !line.includes('console.log')) {
          console.log(`${fullPath}:${idx + 1}: ${line.trim().slice(0, 120)}`);
        }
      });
    }
  }
}

console.log('=== PAGES ===');
searchMatches('billing/frontend/src/pages');
console.log('=== COMPONENTS ===');
searchMatches('billing/frontend/src/components');
console.log('=== SERVICES ===');
searchMatches('billing/frontend/src/services');
