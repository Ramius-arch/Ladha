const { Sequelize } = require('sequelize');
require('dotenv').config();
const path = require('path');

// Modular, pooled, and resilient database connection blueprint
const connectDatabase = () => {
  const isProduction = process.env.NODE_ENV === 'production' || process.env.DATABASE_URL;
  
  if (isProduction) {
    if (!process.env.DATABASE_URL) {
      console.error('CRITICAL: DATABASE_URL not found in production environment.');
      process.exit(1);
    }

    // Optimization: Connection pooling is critical for performance on dedicated platforms
    return new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      protocol: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      pool: {
        max: 10, // Increased for better concurrency
        min: 2,
        acquire: 60000,
        idle: 10000,
        evict: 1000 
      },
      retry: {
        max: 5,
        match: [
          /SequelizeConnectionError/,
          /SequelizeConnectionRefusedError/,
          /SequelizeHostNotFoundError/,
          /SequelizeHostNotReachableError/,
          /SequelizeInvalidConnectionError/,
          /SequelizeConnectionTimedOutError/
        ],
        backoffBase: 1000,
        backoffExponent: 1.5
      },
      logging: false // Disable logging in production for performance
    });
  } else {
    // Local development fallback
    return new Sequelize({
      dialect: 'sqlite',
      storage: path.join(__dirname, '../../database.sqlite'),
      logging: false // Reduced noise for developer productivity
    });
  }
};

const sequelize = connectDatabase();

module.exports = sequelize;
