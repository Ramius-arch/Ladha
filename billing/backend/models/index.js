const sequelize = require('../config/database');

const db = {};
db.Sequelize = require('sequelize');
db.sequelize = sequelize;

// Import foundational models
console.log('Loading models...');
db.Customer = require('./Customer')(sequelize);
db.Plan = require('./Plan')(sequelize);
db.Bill = require('./Bill')(sequelize);
db.Payment = require('./Payment')(sequelize);
db.UsageLog = require('./UsageLog')(sequelize);
db.Invoice = require('./Invoice')(sequelize);
db.InvoiceLine = require('./InvoiceLine')(sequelize);
db.Report = require('./Report')(sequelize);
db.SystemConfig = require('./SysConfigModel')(sequelize);

// Import commerce & double-entry ledger models
db.Order = require('./Order')(sequelize);
db.OrderLine = require('./OrderLine')(sequelize);
db.StockReservation = require('./StockReservation')(sequelize);
db.PaymentIntent = require('./PaymentIntent')(sequelize);
db.LedgerAccount = require('./LedgerAccount')(sequelize);
db.JournalEntry = require('./JournalEntry')(sequelize);
db.JournalLine = require('./JournalLine')(sequelize);
db.IdempotencyRecord = require('./IdempotencyRecord')(sequelize);

// Legacy/Subscription Associations
db.Customer.hasMany(db.Bill, { foreignKey: 'customerId' });
db.Bill.belongsTo(db.Customer, { foreignKey: 'customerId' });

db.Customer.belongsTo(db.Plan, { foreignKey: 'planId', constraints: false });
db.Plan.hasMany(db.Customer, { foreignKey: 'planId' });

db.Bill.belongsTo(db.Plan, { foreignKey: 'planId', constraints: false });
db.Plan.hasMany(db.Bill, { foreignKey: 'planId' });

db.UsageLog.belongsTo(db.Customer, { foreignKey: 'customerId', constraints: false });
db.UsageLog.belongsTo(db.Plan, { foreignKey: 'planId', constraints: false });
db.Customer.hasMany(db.UsageLog, { foreignKey: 'customerId' });
db.Plan.hasMany(db.UsageLog, { foreignKey: 'planId' });

db.Payment.belongsTo(db.Customer, { foreignKey: 'customerId' });
db.Customer.hasMany(db.Payment, { foreignKey: 'customerId' });

db.Payment.belongsTo(db.Bill, { foreignKey: 'billId', constraints: false });
db.Bill.hasMany(db.Payment, { foreignKey: 'billId' });

db.Invoice.belongsTo(db.Bill, { foreignKey: 'billId', constraints: false });
db.Bill.hasMany(db.Invoice, { foreignKey: 'billId' });

db.Report.belongsTo(db.Customer, { foreignKey: 'customerId' });
db.Customer.hasMany(db.Report, { foreignKey: 'customerId' });

// Modern Commerce & Order Associations
db.Customer.hasMany(db.Order, { foreignKey: 'customerId' });
db.Order.belongsTo(db.Customer, { foreignKey: 'customerId' });

db.Order.hasMany(db.OrderLine, { foreignKey: 'orderId', as: 'lines' });
db.OrderLine.belongsTo(db.Order, { foreignKey: 'orderId' });

db.Order.hasMany(db.StockReservation, { foreignKey: 'orderId', as: 'reservations' });
db.StockReservation.belongsTo(db.Order, { foreignKey: 'orderId' });

db.Order.hasMany(db.PaymentIntent, { foreignKey: 'orderId', as: 'paymentIntents' });
db.PaymentIntent.belongsTo(db.Order, { foreignKey: 'orderId' });

db.Customer.hasMany(db.PaymentIntent, { foreignKey: 'customerId' });
db.PaymentIntent.belongsTo(db.Customer, { foreignKey: 'customerId' });

db.Order.hasOne(db.Invoice, { foreignKey: 'orderId', as: 'invoice' });
db.Invoice.belongsTo(db.Order, { foreignKey: 'orderId' });

db.Customer.hasMany(db.Invoice, { foreignKey: 'customerId' });
db.Invoice.belongsTo(db.Customer, { foreignKey: 'customerId' });

db.Invoice.hasMany(db.InvoiceLine, { foreignKey: 'invoiceId', as: 'lines' });
db.InvoiceLine.belongsTo(db.Invoice, { foreignKey: 'invoiceId' });

db.Order.hasMany(db.Payment, { foreignKey: 'orderId' });
db.Payment.belongsTo(db.Order, { foreignKey: 'orderId' });

// Double-Entry Ledger Associations
db.JournalEntry.hasMany(db.JournalLine, { foreignKey: 'journalEntryId', as: 'lines' });
db.JournalLine.belongsTo(db.JournalEntry, { foreignKey: 'journalEntryId' });

db.LedgerAccount.hasMany(db.JournalLine, { foreignKey: 'accountId' });
db.JournalLine.belongsTo(db.LedgerAccount, { foreignKey: 'accountId', as: 'account' });

module.exports = db;
