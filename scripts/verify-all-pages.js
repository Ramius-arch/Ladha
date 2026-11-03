const fs = require('fs');
const path = require('path');
const { parse, compileTemplate } = require('../billing/frontend/node_modules/@vue/compiler-sfc');

const pagesDir = path.join(__dirname, '../billing/frontend/src/pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.vue'));

console.log('Testing all Vue SFC components with @vue/compiler-sfc:');
let hasError = false;

for (const f of files) {
  const filePath = path.join(pagesDir, f);
  const source = fs.readFileSync(filePath, 'utf8');
  try {
    const { descriptor, errors } = parse(source, { filename: f });
    if (errors && errors.length > 0) {
      console.error(`✗ ${f} SFC Parse Error:`, errors);
      hasError = true;
      continue;
    }

    if (descriptor.template) {
      const templateResult = compileTemplate({
        id: f,
        source: descriptor.template.content,
        filename: f,
        compilerOptions: {}
      });
      if (templateResult.errors && templateResult.errors.length > 0) {
        console.error(`✗ ${f} Template Compile Error:`, templateResult.errors);
        hasError = true;
        continue;
      }
    }

    console.log(`✓ ${f} parsed & template compiled clean`);
  } catch (err) {
    console.error(`✗ ${f} Error:`, err);
    hasError = true;
  }
}

if (!hasError) {
  console.log('All page SFCs compiled cleanly!');
}
