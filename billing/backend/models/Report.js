const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Report = sequelize.define('Report', {
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
    reportType: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'e.g., "Usage", "Financial Summary", "Billing Trends"'
    },
    data: {
      type: DataTypes.JSONB, // JSONB for better performance with JSON data in PostgreSQL
      allowNull: false,
      comment: 'The actual report data in JSON format'
    },
    generatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
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
  });
  return Report;
};
