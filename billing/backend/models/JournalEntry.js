// backend/models/JournalEntry.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const JournalEntry = sequelize.define('JournalEntry', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    entryNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true // e.g. 'JE-2026-0001'
    },
    entryDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    sourceType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'e.g., order, invoice, payment, refund'
    },
    sourceId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'ID or reference of the triggering transaction'
    },
    totalAmount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    }
  }, {
    timestamps: true
  });

  return JournalEntry;
};
