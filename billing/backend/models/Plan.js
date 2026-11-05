// backend/models/Plan.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Plan = sequelize.define('Plan', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: 'Name of the billing plan (e.g., "Basic Plan", "Premium Plan")'
    },
    call_minutes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Number of included minutes per month'
    },
    sms_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Number of included SMS per month'
    },
    data_usage: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Data limit in MB/GB for the plan'
    },
    callRate: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      comment: 'Rate per call minute'
    },
    dataRate: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      comment: 'Rate per unit of data usage'
    },
    smsRate: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      comment: 'Rate per SMS'
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      comment: 'Monthly price of the plan'
    },
    features: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Additional features included in the plan (e.g., {call_redirect: true, voicemail: true})'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active',
      comment: 'Whether the plan is currently available or not'
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
  }, {
    paranoid: true, // For soft deletes
  });
  return Plan;
};
