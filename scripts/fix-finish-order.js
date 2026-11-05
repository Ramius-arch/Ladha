const fs = require('fs');

let s = fs.readFileSync('storefront/checkout.html', 'utf8').replace(/\r\n/g, '\n');

const target = `                const finishOrder = (orderCode, receiptCode) => {`;
const replacement = `                let isFinished = false;
                const finishOrder = (orderCode, receiptCode) => {
                    if (isFinished) return;
                    isFinished = true;
                    console.log('finishOrder executed successfully:', orderCode);`;

s = s.replace(target, replacement);

const targetCatch = `                    } catch (err) {
                        const orderCode = 'LDH-' + Math.floor(1000 + Math.random() * 9000) + '-KE';
                        const receipt = 'QK' + Math.floor(100000 + Math.random() * 900000) + 'X';
                        finishOrder(orderCode, receipt);
                    }`;

const replacementCatch = `                    } catch (err) {
                        if (!isFinished) {
                            const orderCode = 'LDH-' + Math.floor(1000 + Math.random() * 9000) + '-KE';
                            const receipt = 'QK' + Math.floor(100000 + Math.random() * 900000) + 'X';
                            finishOrder(orderCode, receipt);
                        }
                    }`;

s = s.replace(targetCatch, replacementCatch);
fs.writeFileSync('storefront/checkout.html', s.replace(/\n/g, '\r\n'), 'utf8');
console.log('checkout.html guarded against duplicate finishOrder.');
