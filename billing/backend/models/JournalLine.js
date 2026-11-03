// backend/models/JournalLine.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const JournalLine = sequelize.define('JournalLine', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    journalEntryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'JournalEntries',
        key: 'id'
      }
    },
    accountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'LedgerAccounts',
        key: 'id'
      }
    },
    debit: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    credit: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    timestamps: true
  });

  return JournalLine;
};
