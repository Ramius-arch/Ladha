// backend/models/InvoiceLine.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const InvoiceLine = sequelize.define('InvoiceLine', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    invoiceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Invoices',
        key: 'id'
      }
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    quantity: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 1
    },
    unitPrice: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    taxRate: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.16
    }
  }, {
    timestamps: true
  });

  return InvoiceLine;
};
