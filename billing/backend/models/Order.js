// backend/models/Order.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    orderNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    storeId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'ladha-nairobi'
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Customers',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('pending_payment', 'paid', 'fulfilled', 'cancelled', 'refunded'),
      defaultValue: 'pending_payment',
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(10),
      defaultValue: 'KES',
      allowNull: false
    },
    subtotal: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    shippingTotal: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    taxTotal: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    total: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    shippingZone: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    shippingAddress: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    customerName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    customerPhone: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    customerEmail: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    paymentMethod: {
      type: DataTypes.STRING(50),
      defaultValue: 'mpesa'
    },
    mpesaReceipt: {
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

  return Order;
};
