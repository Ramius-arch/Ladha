// backend/models/LedgerAccount.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const LedgerAccount = sequelize.define('LedgerAccount', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true // e.g. '1100', '4000', '2200'
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false // e.g. 'M-Pesa Clearing', 'Sales - Archival Apparel'
    },
    type: {
      type: DataTypes.ENUM('asset', 'liability', 'equity', 'revenue', 'expense'),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  }, {
    timestamps: true
  });

  return LedgerAccount;
};
