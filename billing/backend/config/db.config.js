require('dotenv').config();
const path = require('path');

module.exports = {
  db: {
    url: process.env.DATABASE_URL,
    dialect: process.env.DATABASE_URL ? 'postgres' : 'sqlite',
    storage: path.join(__dirname, '../database.sqlite'), // For SQLite fallback
    dialectOptions: process.env.DATABASE_URL ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {},
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
};
