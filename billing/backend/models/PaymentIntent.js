// backend/models/PaymentIntent.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PaymentIntent = sequelize.define('PaymentIntent', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Orders',
        key: 'id'
      }
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Customers',
        key: 'id'
      }
    },
    checkoutRequestId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    provider: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'mpesa'
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'KES'
    },
    phoneNumber: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('requires_action', 'processing', 'succeeded', 'failed', 'cancelled', 'expired'),
      defaultValue: 'requires_action',
      allowNull: false
    },
    receiptNumber: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    failureReason: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    idempotencyKey: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    timestamps: true
  });

  return PaymentIntent;
};
