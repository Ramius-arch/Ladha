const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UsageLog = sequelize.define('UsageLog', {
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
      allowNull: false,
      references: {
        model: 'Plans',
        key: 'id'
      }
    },
    usageType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Usage or commerce transaction type (e.g., call, sms, data, retail_order)'
    },
    duration: {
      type: DataTypes.FLOAT,
      allowNull: false,
      comment: 'Duration in minutes for calls; count for SMS; data usage in MB/GB'
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    billed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'UsageLog',
    timestamps: true
  });
  return UsageLog;
};
