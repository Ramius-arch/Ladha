// backend/models/OrderLine.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OrderLine = sequelize.define('OrderLine', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    sku: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    unitPrice: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    taxRate: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.16 // 16% VAT default in Kenya
    },
    lineTotal: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    variantId: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    timestamps: true
  });

  return OrderLine;
};
