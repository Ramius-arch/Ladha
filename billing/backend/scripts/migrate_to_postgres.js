/**
 * Database Migration Script: SQLite to PostgreSQL
 * 
 * This script facilitates the transfer of records from the local 'inbuilt' SQLite database
 * to the dedicated PostgreSQL instance (e.g., Neon).
 * 
 * Usage: 
 * 1. Set DATABASE_URL in your environment.
 * 2. Run: node backend/scripts/migrate_to_postgres.js
 */

const { Sequelize } = require('sequelize');
const path = require('path');

// Models (Simplified for direct extraction/insertion)
async function migrate() {
  console.log('--- Starting Production Database Migration ---');

  // 1. Initialize SQLite Source
  const sqlite = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../database.sqlite'),
    logging: false
  });

  // 2. Initialize PostgreSQL Target
  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL environment variable is required.');
    process.exit(1);
  }

  const postgres = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
    logging: false
  });

  try {
    console.log('Testing connections...');
    await sqlite.authenticate();
    await postgres.authenticate();
    console.log('Connections verified.');

    // Table List for Sequential Migration
    const tables = ['Plans', 'Customers', 'UsageLogs', 'Bills', 'Invoices', 'Payments', 'Reports'];

    for (const table of tables) {
      console.log(`Migrating table: ${table}...`);
      
      // Fetch data from SQLite
      const [results] = await sqlite.query(`SELECT * FROM ${table}`);
      console.log(`Found ${results.length} records.`);

      if (results.length > 0) {
        // Insert into PostgreSQL (Batching to prevent memory issues)
        const BATCH_SIZE = 100;
        for (let i = 0; i < results.length; i += BATCH_SIZE) {
          const batch = results.slice(i, i + BATCH_SIZE);
          
          // Construct raw INSERT for speed and to bypass Sequelize hooks/validation for migration
          const columns = Object.keys(batch[0]).join(', ');
          const placeholders = batch.map((_, idx) => 
            `(${Object.keys(batch[0]).map((__, colIdx) => `$${idx * Object.keys(batch[0]).length + colIdx + 1}`).join(', ')})`
          ).join(', ');

          const values = batch.flatMap(obj => Object.values(obj));

          await postgres.query(`INSERT INTO "${table}" (${columns}) VALUES ${placeholders} ON CONFLICT DO NOTHING`, {
            bind: values
          });

          console.log(`Migrated batch ${Math.floor(i / BATCH_SIZE) + 1}...`);
        }
      }
      console.log(`Table ${table} migration complete.`);
    }

    console.log('--- ALL DATA MIGRATED SUCCESSFULLY ---');
  } catch (error) {
    console.error('MIGRATION FAILED:', error.message);
  } finally {
    await sqlite.close();
    await postgres.close();
    process.exit(0);
  }
}

migrate();
