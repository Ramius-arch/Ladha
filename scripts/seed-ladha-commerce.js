const db = require('../billing/backend/models');
const ledgerService = require('../billing/backend/services/commerce/ledger');

async function seedLadhaCommerce() {
  console.log('--- Seeding Ladha Archival Streetwear Commerce Data ---');
  try {
    await db.sequelize.authenticate();
    console.log('Database connected.');

    // 1. Wipe old telecom and orphaned records cleanly
    console.log('Clearing old records...');
    await db.sequelize.query('PRAGMA foreign_keys = OFF;');
    const tables = ['JournalLines', 'JournalEntries', 'LedgerAccounts', 'InvoiceLines', 'Invoices', 'PaymentIntents', 'StockReservations', 'OrderLines', 'Orders', 'Payments', 'Bills', 'UsageLogs', 'Customers', 'Plans'];
    for (const t of tables) {
      try {
        await db.sequelize.query(`DELETE FROM ${t};`);
        await db.sequelize.query(`DELETE FROM sqlite_sequence WHERE name='${t}';`);
      } catch (e) {}
    }
    await db.sequelize.query('PRAGMA foreign_keys = ON;');

    // 2. Initialize Standard Ledger Accounts
    console.log('Creating double-entry ledger accounts...');
    const accounts = await db.LedgerAccount.bulkCreate([
      { code: '1100', name: 'M-Pesa Clearing & Settlement', type: 'asset', balance: 0 },
      { code: '1200', name: 'Accounts Receivable (Shoppers)', type: 'asset', balance: 0 },
      { code: '2200', name: 'KRA Output VAT Payable (16%)', type: 'liability', balance: 0 },
      { code: '4000', name: 'Sales Revenue - Archival Streetwear', type: 'revenue', balance: 0 },
      { code: '4100', name: 'Courier & Logistics Tariffs Income', type: 'revenue', balance: 0 }
    ]);
    const accMap = {};
    accounts.forEach(a => { accMap[a.code] = a; });

    // 3. Create VIP Fashion Plans (for compatibility)
    const vipTier = await db.Plan.create({ name: 'Ladha Archival VIP Club', price: 0 });

    // 4. Create Authentic Nairobi Streetwear Shoppers
    console.log('Creating Nairobi VIP shoppers...');
    const shoppersData = [
      { name: 'Kevin Ochieng', email: 'kevin.ochieng@gmail.com', phone_number: '254712345678', address: 'Kilimani, Nairobi', zone: 'Kilimani' },
      { name: 'Amina Wambui', email: 'amina.wambui@yahoo.com', phone_number: '254722998877', address: 'Westlands, Nairobi', zone: 'Westlands' },
      { name: 'Brian Mutua', email: 'brian.mutua@outlook.com', phone_number: '254733456789', address: 'CBD, Nairobi', zone: 'CBD' },
      { name: 'Faith Chebet', email: 'faith.chebet@gmail.com', phone_number: '254701234567', address: 'Karen, Nairobi', zone: 'Karen' },
      { name: 'Ian Macharia', email: 'ian.macharia@icloud.com', phone_number: '254711556677', address: 'Lavington, Nairobi', zone: 'Lavington' },
      { name: 'Stephanie Njeri', email: 'stephanie.njeri@gmail.com', phone_number: '254720112233', address: 'Kileleshwa, Nairobi', zone: 'Kileleshwa' },
      { name: 'David Kimani', email: 'david.kimani@gmail.com', phone_number: '254798334455', address: 'Runda, Nairobi', zone: 'Runda' },
      { name: 'Brenda Achieng', email: 'brenda.achieng@yahoo.com', phone_number: '254715667788', address: 'Parklands, Nairobi', zone: 'Parklands' },
      { name: 'Dennis Kiprop', email: 'dennis.kiprop@gmail.com', phone_number: '254723889900', address: 'South C, Nairobi', zone: 'South C' },
      { name: 'Yvonne Muthoni', email: 'yvonne.muthoni@gmail.com', phone_number: '254705443322', address: 'Ngong Road, Nairobi', zone: 'Ngong Road' }
    ];

    const customers = [];
    for (const s of shoppersData) {
      const c = await db.Customer.create({
        name: s.name,
        email: s.email,
        phone_number: s.phone_number,
        address: s.address,
        planId: vipTier.id,
        status: 'active'
      });
      c.zone = s.zone;
      customers.push(c);
    }

    // 5. Garment Catalog matching storefront/data/products.json
    const catalog = [
      { id: 'product-1', title: 'Vintage Nike Colorblock Windbreaker', sku: 'LDH-VNW-001', price: 3500, category: 'STREETWEAR', image: 'assets/products/product-1.jpg' },
      { id: 'product-2', title: 'Oversized Acid Washed Denim Jacket', sku: 'LDH-OAD-002', price: 2800, category: "WOMEN'S", image: 'assets/products/product-2.jpg' },
      { id: 'product-3', title: 'Ralph Lauren Classic Oxford Shirt', sku: 'LDH-RLO-003', price: 1500, category: "MEN'S", image: 'assets/products/product-3.jpg' },
      { id: 'product-4', title: "90s Levi's 501 Raw Selvedge", sku: 'LDH-L50-004', price: 4200, category: 'VINTAGE', image: 'assets/products/product-4.jpg' },
      { id: 'product-5', title: 'Carhartt Duck Double-Knee Work Pants', sku: 'LDH-CDK-005', price: 3000, category: 'STREETWEAR', image: 'assets/products/product-5.jpg' },
      { id: 'product-6', title: 'Minimalist Bias-Cut Silk Midi Skirt', sku: 'LDH-MSM-006', price: 1800, category: "WOMEN'S", image: 'assets/products/product-6.jpg' },
      { id: 'product-7', title: 'Timberland Heavyweight Plaid Flannel', sku: 'LDH-TPF-007', price: 2200, category: "MEN'S", image: 'assets/products/product-7.jpg' },
      { id: 'product-8', title: 'Champion Reverse Weave Hoodie', sku: 'LDH-CRW-008', price: 3800, category: 'VINTAGE', image: 'assets/products/product-8.jpg' },
      { id: 'product-9', title: 'Stüssy Tribe Archive Graphic Tee', sku: 'LDH-STA-009', price: 1200, category: 'STREETWEAR', image: 'assets/products/product-9.jpg' }
    ];

    const zoneTariffs = {
      'Kilimani': 250,
      'Westlands': 250,
      'CBD': 200,
      'Karen': 400,
      'Lavington': 250,
      'Kileleshwa': 250,
      'Runda': 400,
      'Parklands': 250,
      'South C': 250,
      'Ngong Road': 300
    };

    const mpesaReceipts = [
      'MPESA-RH8291X4', 'MPESA-QK1092MN', 'MPESA-WX8821AB', 'MPESA-JK7712CC',
      'MPESA-YT4419PP', 'MPESA-NM3182DD', 'MPESA-PL9921EE', 'MPESA-ZZ1092FF',
      'MPESA-KK4412GG', 'MPESA-BB5519HH'
    ];

    console.log('Creating Orders, Invoices, Payments and Balanced Journal Entries...');

    let runningTotalDebits = 0;
    let runningTotalCredits = 0;

    for (let i = 0; i < customers.length; i++) {
      const customer = customers[i];
      const garment = catalog[i % catalog.length];
      const courierTariff = zoneTariffs[customer.zone] || 250;
      const subtotalGross = garment.price;
      const totalGross = subtotalGross + courierTariff;

      // 16% VAT breakdown
      const netMerchandise = Math.round((subtotalGross / 1.16) * 100) / 100;
      const vatMerchandise = Math.round((subtotalGross - netMerchandise) * 100) / 100;
      const netCourier = Math.round((courierTariff / 1.16) * 100) / 100;
      const vatCourier = Math.round((courierTariff - netCourier) * 100) / 100;
      const totalNet = Math.round((netMerchandise + netCourier) * 100) / 100;
      const totalVat = Math.round((vatMerchandise + vatCourier) * 100) / 100;

      const orderNumber = `LDH-${9010 + i}-KE`;
      const mpesaCode = mpesaReceipts[i];
      const orderDate = new Date(Date.now() - (customers.length - i) * 3600 * 1000 * 4);

      // Order
      const order = await db.Order.create({
        orderNumber,
        storeId: 'ladha',
        customerId: customer.id,
        customerName: customer.name,
        customerPhone: customer.phone_number,
        shippingAddress: customer.address,
        shippingZone: customer.zone,
        currency: 'KES',
        subtotal: subtotalGross,
        shippingTotal: courierTariff,
        taxTotal: totalVat,
        total: totalGross,
        status: 'paid',
        paymentStatus: 'paid',
        mpesaReceipt: mpesaCode,
        createdAt: orderDate,
        updatedAt: orderDate
      });

      // OrderLine
      await db.OrderLine.create({
        orderId: order.id,
        productId: garment.id,
        sku: garment.sku,
        title: garment.title,
        unitPrice: garment.price,
        quantity: 1,
        taxRate: 0.16,
        lineTotal: garment.price,
        image: garment.image
      });

      // Invoice
      const invoice = await db.Invoice.create({
        invoiceNumber: `INV-${orderNumber}`,
        customerId: customer.id,
        subtotal: totalNet,
        taxTotal: totalVat,
        amountDue: 0,
        total: totalGross,
        status: 'paid',
        issueDate: orderDate,
        dueDate: orderDate,
        currency: 'KES',
        notes: `Archival garment purchase & ${customer.zone} courier dispatch. 16% VAT inclusive.`,
        createdAt: orderDate,
        updatedAt: orderDate
      });

      // Invoice Line
      await db.InvoiceLine.create({
        invoiceId: invoice.id,
        description: `${garment.title} (${garment.sku})`,
        quantity: 1,
        unitPrice: garment.price,
        amount: garment.price,
        taxRate: 0.16
      });

      // Payment
      await db.Payment.create({
        customerId: customer.id,
        orderId: order.id,
        invoiceId: invoice.id,
        amount: totalGross,
        paymentMethod: 'mpesa',
        status: 'completed',
        referenceNumber: mpesaCode,
        paymentDate: orderDate,
        createdAt: orderDate,
        updatedAt: orderDate
      });

      // Journal Entry: Double-Entry Balancing via Ledger Service
      await ledgerService.postJournalEntry({
        reference: `JE-${orderNumber}`,
        description: `Order ${orderNumber} - ${garment.title} M-Pesa Drop Checkout`,
        sourceType: 'order',
        sourceId: order.id.toString(),
        lines: [
          {
            accountCode: '1100',
            debit: totalGross,
            description: `M-Pesa payment received for ${orderNumber}`
          },
          {
            accountCode: '4000',
            credit: netMerchandise,
            description: `Archival sale: ${garment.title}`
          },
          {
            accountCode: '4100',
            credit: netCourier,
            description: `Courier dispatch tariff (${customer.zone})`
          },
          {
            accountCode: '2200',
            credit: totalVat,
            description: `KRA 16% Output VAT`
          }
        ]
      });

      runningTotalDebits += totalGross;
      runningTotalCredits += (netMerchandise + netCourier + totalVat);

      // UsageLog for compatibility
      await db.UsageLog.create({
        customerId: customer.id,
        planId: vipTier.id,
        usageType: 'drop_sale',
        duration: totalGross,
        timestamp: orderDate
      });
    }

    console.log(`✓ 10 orders created. Total Debits: KES ${runningTotalDebits} | Total Credits: KES ${runningTotalCredits}`);
    console.log('✓ Seeding complete. Ready for clean financial backoffice inspection.');
  } catch (err) {
    console.error('Seeding error:', err);
  }
}

seedLadhaCommerce().then(() => process.exit(0));
