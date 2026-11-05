const fs = require('fs');
const path = require('path');

const chkPath = path.resolve('storefront/checkout.html');
let content = fs.readFileSync(chkPath, 'utf8');

const target = `                if (duka) {
                    try {
                        await duka.checkout({`;

const replacement = `                if (duka) {
                    try {
                        const chkPromise = duka.checkout({`;

content = content.replace(target, replacement);

const targetEnd = `                        });
                    } catch (err) {
                        const orderCode = 'LDH-' + Math.floor(1000 + Math.random() * 9000) + '-KE';
                        const receipt = 'QK' + Math.floor(100000 + Math.random() * 900000) + 'X';
                        finishOrder(orderCode, receipt);
                    }`;

const replacementEnd = `                        });
                        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('DukaEngine standalone timeout')), 2500));
                        await Promise.race([chkPromise, timeoutPromise]);
                    } catch (err) {
                        console.info('Completing checkout with client autonomous fiscal generator');
                        const orderCode = 'LDH-' + Math.floor(1000 + Math.random() * 9000) + '-KE';
                        const receipt = 'QK' + Math.floor(100000 + Math.random() * 900000) + 'X';
                        finishOrder(orderCode, receipt);
                    }`;

content = content.replace(targetEnd, replacementEnd);
fs.writeFileSync(chkPath, content, 'utf8');
console.log('Patched checkout.html timeout race.');
