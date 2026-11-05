const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dbConfig = require('./config/db.config'); // Import database configuration
const db = require('./models'); // Import all models and sequelize instance from index.js

const app = express();

// Security and CSP headers to allow Google Fonts, local APIs, and DevTools
app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:; font-src 'self' https://fonts.gstatic.com https: data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https:; connect-src 'self' http://localhost:5000 http://localhost:3001 http://localhost:5174 https: ws: wss:; img-src 'self' data: blob: https:; media-src 'self' data: blob: https:;"
    );
    next();
});

// Chrome DevTools probe handler to prevent 404 and CSP alerts
app.use('/.well-known', (req, res) => {
    res.status(204).end();
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Serve static frontend assets from dist if available
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
}

// Favicon route to prevent 404 in browsers
app.get('/favicon.ico', (req, res) => {
    const faviconPath = path.join(frontendDist, 'assets', 'logo.png');
    if (fs.existsSync(faviconPath)) {
        return res.sendFile(faviconPath);
    }
    return res.status(204).end();
});

// Serve static storefront assets and clean routes
const storefrontDir = path.resolve(__dirname, '../../storefront');
if (fs.existsSync(storefrontDir)) {
    app.use('/storefront', express.static(storefrontDir));
    
    // Direct clean storefront routes on port 5000
    const storefrontRoutes = ['/checkout', '/shop', '/about', '/legal', '/product'];
    storefrontRoutes.forEach(route => {
        const handler = (req, res) => {
            const htmlFile = path.join(storefrontDir, `${route.slice(1)}.html`);
            if (fs.existsSync(htmlFile)) {
                return res.sendFile(htmlFile);
            }
            res.redirect(`http://localhost:3001${route}.html`);
        };
        app.get(route, handler);
        app.get(`${route}.html`, handler);
    });

    // Storefront static folders accessed by relative paths
    app.use('/css', express.static(path.join(storefrontDir, 'css')));
    app.use('/js', express.static(path.join(storefrontDir, 'js')));
    app.use('/data', express.static(path.join(storefrontDir, 'data')));
    // Fallback static for storefront assets if not already matched in dist
    app.use('/assets', express.static(path.join(storefrontDir, 'assets')));
}

// Import routes
const customerRoutes = require('./routes/customers.routes');
const planRoutes = require('./routes/plans.routes');
const billRoutes = require('./routes/billing.routes');
const paymentRoutes = require('./routes/payments.routes');
const usageRoutes = require('./routes/usage.routes');
const invoiceRoutes = require('./routes/invoices.routes');
const reportRoutes = require('./routes/reports.routes');
const healthRoutes = require('./routes/health.routes');
const configRoutes = require('./routes/config.routes');
const dukaRoutes = require('./routes/duka.routes');
const ladhaRoutes = require('./routes/ladha.routes');

const { errorHandler } = require('./middleware/errorHandler');

// Use routes
app.use('/api/customers', customerRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/billing', billRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/usage', usageRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/config', configRoutes);
app.use('/api', dukaRoutes);
app.use('/api/ladha', ladhaRoutes);

// Error handler (should be after routes)
app.use(errorHandler);

// SPA client fallback for frontend routing (Dashboard, Customers, etc.)
app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api')) {
        return next();
    }
    const indexHtml = path.join(frontendDist, 'index.html');
    if (fs.existsSync(indexHtml)) {
        return res.sendFile(indexHtml);
    }
    return res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

// Friendly 404 handler (prevents finalhandler from setting default-src 'none')
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

const reservationSweeper = require('./services/commerce/reservationSweeper');
const reconciliationService = require('./services/commerce/reconciliationService');

// In development, we use 'force: true' to ensure a clean state for seeding
// In production, we avoid 'alter: true' as it can be unreliable with PostgreSQL
db.sequelize.sync({ force: !isProduction }) 
    .then(async () => {
        console.log('Database synchronized');
        await seedDatabase(); // Seed database with initial demo data
        reservationSweeper.startSweeper(30000); // 30s TTL interval
        reconciliationService.startDaemon(); // 60s automated double-entry ledger reconciliation daemon
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to synchronize database:', err);
        process.exit(1);
    });

async function seedDatabase() {
    const generateDemoData = require('./services/demoData');
    const ledger = require('./services/commerce/ledger');
    const pricing = require('./services/commerce/pricing');
    const { customers, plans, bills, payments, usageLogs, invoices, reports } = generateDemoData();
    try {
        await db.Plan.bulkCreate(plans, { ignoreDuplicates: true });
        await db.Customer.bulkCreate(customers, { ignoreDuplicates: true });
        await db.Bill.bulkCreate(bills, { ignoreDuplicates: true });
        await db.Payment.bulkCreate(payments, { ignoreDuplicates: true });
        await db.UsageLog.bulkCreate(usageLogs, { ignoreDuplicates: true });
        await db.Invoice.bulkCreate(invoices, { ignoreDuplicates: true });
        await db.Report.bulkCreate(reports, { ignoreDuplicates: true });
        await ledger.ensureAccounts();

        // Seed sample Ladha storefront orders with lines and balanced ledger entries
        const sampleOrders = [
            {
                orderNumber: 'LDH-8921-KE',
                customerName: 'Kevin Ochieng',
                phone: '0712345678',
                zone: 'Kilimani, Nairobi',
                item: { id: 'product-1', title: 'Vintage Nike Colorblock Windbreaker', price: 3500 },
                deliveryFee: 250,
                receipt: 'MPESA-RH8291X4'
            },
            {
                orderNumber: 'LDH-8922-KE',
                customerName: 'Amina Wambui',
                phone: '0722998877',
                zone: 'Westlands, Nairobi',
                item: { id: 'product-2', title: 'Oversized Acid Washed Denim Jacket', price: 2800 },
                deliveryFee: 250,
                receipt: 'MPESA-QK1092MN'
            },
            {
                orderNumber: 'LDH-8923-KE',
                customerName: 'Brian Mutua',
                phone: '0733456789',
                zone: 'CBD, Nairobi',
                item: { id: 'product-3', title: 'Ralph Lauren Classic Oxford Shirt', price: 1500 },
                deliveryFee: 200,
                receipt: 'MPESA-WX8821AB'
            },
            {
                orderNumber: 'LDH-8924-KE',
                customerName: 'Faith Chebet',
                phone: '0701234567',
                zone: 'Karen, Nairobi',
                item: { id: 'product-4', title: "90s Levi's 501 Raw Selvedge", price: 4200 },
                deliveryFee: 400,
                receipt: 'MPESA-JK7712CC'
            },
            {
                orderNumber: 'LDH-8925-KE',
                customerName: 'Ian Macharia',
                phone: '0711556677',
                zone: 'Lavington, Nairobi',
                item: { id: 'product-5', title: 'Carhartt Duck Double-Knee Work Pants', price: 3000 },
                deliveryFee: 250,
                receipt: 'MPESA-YT4419PP'
            },
            {
                orderNumber: 'LDH-8926-KE',
                customerName: 'Stephanie Njeri',
                phone: '0720112233',
                zone: 'Kileleshwa, Nairobi',
                item: { id: 'product-6', title: 'Minimalist Bias-Cut Silk Midi Skirt', price: 1800 },
                deliveryFee: 250,
                receipt: 'MPESA-NM3182DD'
            },
            {
                orderNumber: 'LDH-8927-KE',
                customerName: 'David Kimani',
                phone: '0798334455',
                zone: 'Runda, Nairobi',
                item: { id: 'product-7', title: 'Timberland Heavyweight Plaid Flannel', price: 2200 },
                deliveryFee: 400,
                receipt: 'MPESA-PL9921EE'
            },
            {
                orderNumber: 'LDH-8928-KE',
                customerName: 'Brenda Achieng',
                phone: '0715667788',
                zone: 'Parklands, Nairobi',
                item: { id: 'product-8', title: 'Champion Reverse Weave Hoodie', price: 3800 },
                deliveryFee: 250,
                receipt: 'MPESA-ZZ1092FF'
            },
            {
                orderNumber: 'LDH-8929-KE',
                customerName: 'Dennis Kiprop',
                phone: '0723889900',
                zone: 'South C, Nairobi',
                item: { id: 'product-9', title: 'Stüssy Tribe Archive Graphic Tee', price: 1200 },
                deliveryFee: 250,
                receipt: 'MPESA-KK4412GG'
            },
            {
                orderNumber: 'LDH-8930-KE',
                customerName: 'Yvonne Muthoni',
                phone: '0705443322',
                zone: 'Ngong Road, Nairobi',
                item: { id: 'product-1', title: 'Vintage Nike Colorblock Windbreaker', price: 3500 },
                deliveryFee: 300,
                receipt: 'MPESA-CC8831JJ'
            },
            {
                orderNumber: 'LDH-8931-KE',
                customerName: 'Alex Mwangi',
                phone: '0718990112',
                zone: 'Hurlingham, Nairobi',
                item: { id: 'product-4', title: "90s Levi's 501 Raw Selvedge", price: 4200 },
                deliveryFee: 250,
                receipt: 'MPESA-DD9922KK'
            },
            {
                orderNumber: 'LDH-8932-KE',
                customerName: 'Grace Wanjiku',
                phone: '0721334556',
                zone: 'Gigiri, Nairobi',
                item: { id: 'product-8', title: 'Champion Reverse Weave Hoodie', price: 3800 },
                deliveryFee: 350,
                receipt: 'MPESA-EE1133LL'
            }
        ];

        for (const [idx, so] of sampleOrders.entries()) {
            const customer = customers[idx] || customers[0];
            const subtotal = so.item.price;
            const deliveryFee = so.deliveryFee;
            const total = subtotal + deliveryFee;

            const netSales = Math.round((subtotal / (1 + pricing.VAT_RATE)) * 100) / 100;
            const netDelivery = Math.round((deliveryFee / (1 + pricing.VAT_RATE)) * 100) / 100;
            const totalVat = Math.round((total - netSales - netDelivery) * 100) / 100;

            const order = await db.Order.create({
                orderNumber: so.orderNumber,
                storeId: 'ladha-nairobi',
                customerId: customer.id,
                status: 'paid',
                currency: 'KES',
                subtotal,
                shippingTotal: deliveryFee,
                taxTotal: totalVat,
                total,
                shippingZone: so.zone,
                shippingAddress: `${so.zone}, Kenya`,
                customerName: so.customerName,
                customerPhone: so.phone,
                customerEmail: customer.email,
                paymentMethod: 'mpesa',
                mpesaReceipt: so.receipt
            });

            await db.OrderLine.create({
                orderId: order.id,
                productId: so.item.id,
                sku: `SKU-${so.item.id}`,
                title: so.item.title,
                unitPrice: so.item.price,
                quantity: 1,
                taxRate: pricing.VAT_RATE,
                lineTotal: so.item.price
            });

            await db.StockReservation.create({
                orderId: order.id,
                productId: so.item.id,
                reservationId: `${so.orderNumber}_${so.item.id}`,
                status: 'committed',
                expiresAt: new Date(Date.now() + 86400000)
            });

            const invoice = await db.Invoice.create({
                orderId: order.id,
                customerId: customer.id,
                invoiceNumber: `INV-${so.orderNumber}`,
                issueDate: new Date(),
                dueDate: new Date(Date.now() + 7 * 86400000),
                amountDue: total,
                status: 'paid'
            });

            await db.InvoiceLine.create({
                invoiceId: invoice.id,
                description: so.item.title,
                quantity: 1,
                unitPrice: so.item.price,
                amount: so.item.price,
                taxRate: pricing.VAT_RATE
            });

            await db.InvoiceLine.create({
                invoiceId: invoice.id,
                description: `Courier Delivery Tariff (${so.zone})`,
                quantity: 1,
                unitPrice: deliveryFee,
                amount: deliveryFee,
                taxRate: pricing.VAT_RATE
            });

            await db.Payment.create({
                orderId: order.id,
                customerId: customer.id,
                amount: total,
                payment_date: new Date(),
                payment_method: 'mpesa',
                receipt_number: so.receipt,
                status: 'completed'
            });

            // Post verified balanced Double-Entry Journal Entry
            await ledger.postJournalEntry({
                reference: `JE-ORD-${so.orderNumber}`,
                description: `Settlement for Order ${so.orderNumber} via M-Pesa (${so.receipt})`,
                sourceType: 'order',
                sourceId: so.orderNumber,
                lines: [
                    { accountCode: '1100', debit: total, credit: 0, description: 'Incoming M-Pesa clearing' },
                    { accountCode: '4000', debit: 0, credit: netSales, description: 'Archival streetwear net sales' },
                    { accountCode: '4100', debit: 0, credit: netDelivery, description: 'Courier shipping income' },
                    { accountCode: '2200', debit: 0, credit: totalVat, description: 'Output VAT liability (16%)' }
                ]
            });
        }

        console.log('Commerce orders and double-entry ledger seeded successfully!');
    } catch (error) {
        console.error('Failed to seed database:', error);
    }
}

module.exports = app;
