// backend/services/demoData.js
// Authentic Ladha Archival Streetwear Commerce Seed Data

const KENYAN_SHOPPERS = [
    { name: 'Kevin Ochieng', email: 'kevin.ochieng@gmail.com', phone: '0712345678', estate: 'Dennis Pritt Rd, Kilimani', zone: 'Kilimani' },
    { name: 'Amina Wambui', email: 'amina.wambui@yahoo.com', phone: '0722998877', estate: 'Parklands, Westlands', zone: 'Westlands' },
    { name: 'Brian Mutua', email: 'brian.mutua@outlook.com', phone: '0733456789', estate: 'Koinange St, Nairobi CBD', zone: 'CBD' },
    { name: 'Faith Chebet', email: 'faith.chebet@gmail.com', phone: '0701234567', estate: 'Ngong Rd, Karen', zone: 'Karen' },
    { name: 'Ian Macharia', email: 'ian.macharia@icloud.com', phone: '0711556677', estate: 'Lavington Green, Lavington', zone: 'Lavington' },
    { name: 'Stephanie Njeri', email: 'stephanie.njeri@gmail.com', phone: '0720112233', estate: 'Kileleshwa Heights, Kileleshwa', zone: 'Kileleshwa' },
    { name: 'David Kimani', email: 'david.kimani@gmail.com', phone: '0798334455', estate: 'Runda Ridge, Runda', zone: 'Runda' },
    { name: 'Brenda Achieng', email: 'brenda.achieng@yahoo.com', phone: '0715667788', estate: 'Parklands Plaza, Parklands', zone: 'Parklands' },
    { name: 'Dennis Kiprop', email: 'dennis.kiprop@gmail.com', phone: '0723889900', estate: 'South C Estate, South C', zone: 'South C' },
    { name: 'Yvonne Muthoni', email: 'yvonne.muthoni@gmail.com', phone: '0705443322', estate: 'Adams Arcade, Ngong Road', zone: 'Ngong Road' },
    { name: 'Alex Mwangi', email: 'alex.mwangi@gmail.com', phone: '0718990112', estate: 'Argwings Kodhek, Hurlingham', zone: 'Hurlingham' },
    { name: 'Grace Wanjiku', email: 'grace.wanjiku@gmail.com', phone: '0721334556', estate: 'UN Crescent, Gigiri', zone: 'Gigiri' }
];

const GARMENT_CATALOG = [
    { id: 'product-1', title: 'Vintage Nike Colorblock Windbreaker', sku: 'LDH-VNW-001', price: 3500, category: 'STREETWEAR' },
    { id: 'product-2', title: 'Oversized Acid Washed Denim Jacket', sku: 'LDH-OAD-002', price: 2800, category: "WOMEN'S" },
    { id: 'product-3', title: 'Ralph Lauren Classic Oxford Shirt', sku: 'LDH-RLO-003', price: 1500, category: "MEN'S" },
    { id: 'product-4', title: "90s Levi's 501 Raw Selvedge", sku: 'LDH-L50-004', price: 4200, category: 'VINTAGE' },
    { id: 'product-5', title: 'Carhartt Duck Double-Knee Work Pants', sku: 'LDH-CDK-005', price: 3000, category: 'STREETWEAR' },
    { id: 'product-6', title: 'Minimalist Bias-Cut Silk Midi Skirt', sku: 'LDH-MSM-006', price: 1800, category: "WOMEN'S" },
    { id: 'product-7', title: 'Timberland Heavyweight Plaid Flannel', sku: 'LDH-TPF-007', price: 2200, category: "MEN'S" },
    { id: 'product-8', title: 'Champion Reverse Weave Hoodie', sku: 'LDH-CRW-008', price: 3800, category: 'VINTAGE' },
    { id: 'product-9', title: 'Stüssy Tribe Archive Graphic Tee', sku: 'LDH-STA-009', price: 1200, category: 'STREETWEAR' }
];

const ZONE_TARIFFS = {
    'Kilimani': 250,
    'Westlands': 250,
    'CBD': 200,
    'Karen': 400,
    'Lavington': 250,
    'Kileleshwa': 250,
    'Runda': 400,
    'Parklands': 250,
    'South C': 250,
    'Ngong Road': 300,
    'Hurlingham': 250,
    'Gigiri': 350
};

const MPESA_CODES = [
    'MPESA-RH8291X4', 'MPESA-QK1092MN', 'MPESA-WX8821AB', 'MPESA-JK7712CC',
    'MPESA-YT4419PP', 'MPESA-NM3182DD', 'MPESA-PL9921EE', 'MPESA-ZZ1092FF',
    'MPESA-KK4412GG', 'MPESA-BB5519HH', 'MPESA-CC8831JJ', 'MPESA-DD9922KK'
];

const generatePlans = () => [
    {
        id: 1,
        name: 'Ladha Nairobi Archival Retail',
        price: 0,
        call_minutes: 0,
        sms_count: 0,
        data_usage: 0,
        callRate: 0,
        dataRate: 0,
        smsRate: 0,
        status: 'active',
        features: {
            industry: 'Curated Archival Fashion & Retail',
            billingModel: '1-of-1 Physical Goods + Zonal Delivery Tariffs',
            paymentGateways: ['M-Pesa STK Push', 'Nairobi Courier Same-Day'],
            inventoryTracking: 'Real-time Stock Lock & Rollback',
            orderFulfillment: true
        }
    },
    {
        id: 2,
        name: 'Ladha Streetwear VIP Collector',
        price: 0,
        call_minutes: 0,
        sms_count: 0,
        data_usage: 0,
        callRate: 0,
        dataRate: 0,
        smsRate: 0,
        status: 'active',
        features: {
            industry: 'VIP Streetwear Drops',
            billingModel: 'Priority Drop Access'
        }
    }
];

const generateDemoData = () => {
    const plans = generatePlans();
    const customers = [];
    const bills = [];
    const invoices = [];
    const payments = [];
    const usageLogs = [];
    const reports = [];

    let billIdCounter = 1;
    let invoiceIdCounter = 1;
    let paymentIdCounter = 1;
    let usageLogIdCounter = 1;
    let reportIdCounter = 1;

    KENYAN_SHOPPERS.forEach((shopper, idx) => {
        const customerId = idx + 1;
        const garment = GARMENT_CATALOG[idx % GARMENT_CATALOG.length];
        const courier = ZONE_TARIFFS[shopper.zone] || 250;
        const total = garment.price + courier;
        const orderDate = new Date(Date.now() - (KENYAN_SHOPPERS.length - idx) * 3600 * 1000 * 6);
        const mpesaReceipt = MPESA_CODES[idx];

        // Customer
        customers.push({
            id: customerId,
            name: shopper.name,
            phone_number: shopper.phone,
            email: shopper.email,
            address: shopper.estate,
            planId: 1,
            status: 'active',
            createdAt: orderDate,
            updatedAt: orderDate
        });

        // Bill
        const billId = billIdCounter++;
        bills.push({
            id: billId,
            customerId: customerId,
            planId: 1,
            amount: total,
            date: orderDate,
            createdAt: orderDate,
            updatedAt: orderDate
        });

        // Invoice
        const invoiceId = invoiceIdCounter++;
        const isPending = idx === KENYAN_SHOPPERS.length - 1; // Only the last one pending
        invoices.push({
            id: invoiceId,
            customerId: customerId,
            billId: billId,
            invoiceNumber: `INV-LDH-${9010 + idx}-KE`,
            issueDate: orderDate,
            dueDate: new Date(orderDate.getTime() + 7 * 86400000),
            amountDue: isPending ? total : 0,
            pdfPath: null,
            status: isPending ? 'pending' : 'paid',
            createdAt: orderDate,
            updatedAt: orderDate
        });

        // Payment
        const paymentId = paymentIdCounter++;
        payments.push({
            id: paymentId,
            amount: total,
            payment_date: orderDate,
            payment_method: 'mpesa',
            receipt_number: mpesaReceipt,
            status: isPending ? 'pending' : 'completed',
            customerId: customerId,
            billId: billId,
            invoiceId: invoiceId,
            createdAt: orderDate,
            updatedAt: orderDate
        });

        // UsageLog (archival garment & courier orders)
        usageLogs.push({
            id: usageLogIdCounter++,
            customerId: customerId,
            planId: 1,
            usageType: 'drop_sale',
            duration: total,
            timestamp: orderDate,
            createdAt: orderDate,
            updatedAt: orderDate
        });

        // Report
        reports.push({
            id: reportIdCounter++,
            customerId: customerId,
            reportType: 'Archival Retail & Fashion Drop Sales',
            data: {
                garmentTitle: garment.title,
                garmentPrice: garment.price,
                courierFee: courier,
                totalSettled: total,
                zone: shopper.zone,
                mpesaReceipt: mpesaReceipt
            },
            createdAt: orderDate,
            updatedAt: orderDate
        });
    });

    return {
        customers,
        plans,
        bills,
        invoices,
        payments,
        usageLogs,
        reports
    };
};

module.exports = generateDemoData;
