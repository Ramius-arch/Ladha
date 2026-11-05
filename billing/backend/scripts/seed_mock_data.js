const db = require('../models');

async function seedData() {
  try {
    console.log('Seeding impressive mock data...');
    
    // Helper for random numbers
    const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

    // Clear existing tables in correct order
    await db.UsageLog.destroy({ where: {}, truncate: true });
    await db.Bill.destroy({ where: {}, truncate: true });
    await db.Customer.destroy({ where: {}, truncate: true });
    await db.Plan.destroy({ where: {}, truncate: true });

    // Create Plans first
    const plan1 = await db.Plan.create({ name: 'Basic', price: 1000 });
    const plan2 = await db.Plan.create({ name: 'Standard', price: 2000 });
    const plan3 = await db.Plan.create({ name: 'Premium', price: 3000 });
    const plans = [plan1, plan2, plan3];

    for (let i = 0; i < 20; i++) { // 20 customers
      const randId = Date.now() + i;
      const plan = plans[getRandom(0, 2)];
      
      const customer = await db.Customer.create({
        name: `Client ${i + 1}`,
        phone_number: '2547' + getRandom(10000000, 99999999),
        email: `client${i}${randId}@quixora.example`,
        address: `${getRandom(1, 999)} Business Park`,
        planId: plan.id,
        status: 'active'
      });

      // Create data for 6 months to simulate a trend
      for (let m = 0; m < 6; m++) {
        const growthFactor = (m + 1) * 1.2;
        
        // Create Usage
        await db.UsageLog.create({
          customerId: customer.id,
          planId: customer.planId,
          usageType: ['call', 'data', 'sms'][getRandom(0, 2)],
          duration: getRandom(100, 500) * growthFactor,
          timestamp: new Date(2026, m, 1)
        });

        // Create Bill
        await db.Bill.create({
          customerId: customer.id,
          planId: customer.planId,
          billingCycle: `2026-0${m + 1}`,
          totalAmount: getRandom(1000, 3000) * growthFactor,
          status: 'paid'
        });
      }
    }

    console.log('50 random mock records seeded successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
  }
}

seedData().then(() => process.exit());
