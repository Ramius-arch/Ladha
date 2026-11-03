// backend/models/StockReservation.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const StockReservation = sequelize.define('StockReservation', {
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
    productId: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    reservationId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.ENUM('active', 'committed', 'released', 'expired'),
      defaultValue: 'active',
      allowNull: false
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    timestamps: true
  });

  return StockReservation;
};
