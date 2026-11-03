// backend/models/Bill.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Bill = sequelize.define('Bill', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Customers',
        key: 'id'
      }
    },
    planId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Plans',
        key: 'id'
      }
    },
    voiceCallsDuration: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    dataUsage: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    smsCount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    amount: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.getDataValue('totalAmount');
      },
      set(val) {
        this.setDataValue('totalAmount', val);
      }
    },
    paymentStatus: {
      type: DataTypes.ENUM('unpaid', 'paid', 'pending'),
      defaultValue: 'pending'
    },
    invoicePdfUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      onUpdate: () => new Date()
    }
  });

  return Bill;
};
