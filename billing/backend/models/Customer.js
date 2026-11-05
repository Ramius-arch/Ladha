// backend/models/Customer.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Customer = sequelize.define('Customer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    phone_number: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },
    // Virtual alias so customer.phone maps seamlessly to customer.phone_number
    phone: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.getDataValue('phone_number');
      },
      set(val) {
        this.setDataValue('phone_number', val);
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    planId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Retail e-commerce customers do not require a subscription plan!
      references: {
        model: 'Plans',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active',
      validate: {
        isIn: [['active', 'inactive', 'suspended']]
      }
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

  return Customer;
};
