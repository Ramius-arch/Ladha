const fs = require('fs');

let s = fs.readFileSync('storefront/checkout.html', 'utf8').replace(/\r\n/g, '\n');

const target = `                if (!cart.length) {
                    alert('Your shopping bag is empty.');
                    return;
                }`;

const replacement = `                console.log('Checkout submit triggered. Cart items:', cart.length);
                if (!cart.length) {
                    console.warn('Cart is empty on submit!');
                    alert('Your shopping bag is empty.');
                    return;
                }`;

s = s.replace(target, replacement);
fs.writeFileSync('storefront/checkout.html', s.replace(/\n/g, '\r\n'), 'utf8');
console.log('Added log to checkout submit.');
