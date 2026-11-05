// backend/models/IdempotencyRecord.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const IdempotencyRecord = sequelize.define('IdempotencyRecord', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    key: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true
    },
    scope: {
      type: DataTypes.STRING(64),
      defaultValue: 'checkout'
    },
    requestHash: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('processing', 'completed', 'failed'),
      defaultValue: 'processing',
      allowNull: false
    },
    responseStatus: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    responseBody: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    timestamps: true,
    indexes: [
      { unique: true, fields: ['key'] }
    ]
  });

  return IdempotencyRecord;
};
