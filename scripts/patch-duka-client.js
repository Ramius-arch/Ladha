const fs = require('fs');

const dukaPath = 'storefront/js/duka-client.js';
let content = fs.readFileSync(dukaPath, 'utf8').replace(/\r\n/g, '\n');

const target = `        try {
            const res = await fetch(\`\${this.apiUrl}/api/stores/\${this.storeId}/checkout\`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Store-Id': this.storeId,
                    'Idempotency-Key': idempotencyKey
                },
                body: JSON.stringify({
                    customer,
                    items: normalizedItems,
                    payment: { method: paymentMethod }
                })
            });`;

const replacement = `        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            const res = await fetch(\`\${this.apiUrl}/api/stores/\${this.storeId}/checkout\`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Store-Id': this.storeId,
                    'Idempotency-Key': idempotencyKey
                },
                body: JSON.stringify({
                    customer,
                    items: normalizedItems,
                    payment: { method: paymentMethod }
                }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);`;

content = content.replace(target, replacement);
fs.writeFileSync(dukaPath, content.replace(/\n/g, '\r\n'), 'utf8');
console.log('Patched duka-client.js with AbortController timeout.');
